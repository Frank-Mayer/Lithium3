"use strict";

var cryptography = new class {
  salt = "";

  getSalt() {
    firebase.database().ref('salt').once('value').then(s => {
      this.salt = s.val();
    });
  }

  constructor() {
    this.getSalt();
  }

  sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
  }

  encrypt(str, pwd) {
    return btoa(AesCtr.encrypt(AesCtr.encrypt(str, pwd, 256), pwd, 256));
  }

  decrypt(str, pwd) {
    return AesCtr.decrypt(AesCtr.decrypt(atob(str), pwd, 256), pwd, 256);
  }

  generateDBKey() {
    let length = 8;
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  getChatPwd(chat = "") {
    if (chat.length === 0) {
      chat = viewingChat;
    }
    let pwd = "";
    for (let key in localDB.chats) {
      let el = localDB.chats[key];
      if (el.name === chat) {
        pwd = this.decrypt(el.key, localDB.usrPwd);
        break;
      }
    }
    return pwd;
  }

  async getHash(str) {
    for (let r = 1; r < 5000; r++) {
      str = await this.sha512(str + this.salt + r.toString());
    }
    return str;
  }

  async pwdHash(str) {
    for (let r = 1; r < 15000; r++) {
      str = await this.sha512(str + this.salt + r.toString());
    }
    return str;
  }

  async digestStr(str) {
    const msgUint8 = new TextEncoder().encode(str);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }

  async isPasswordLeaked(h, then) {
    try {
      let hs = h.substr(0, 5);
      let requestUrl = 'https://api.pwnedpasswords.com/range/' + hs;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", requestUrl, true);
      xhr.onload = async function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let hashData = xhr.responseText;
            let hashList = hashData.split('\n');
            if (hashData.includes(h.substr(5).toUpperCase())) {
              then(true);
            }
            else {
              then(false);
            }
          } else {
            console.error(xhr.statusText);
            then(false);
          }
        }
      };
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
        then(false);
      };
      xhr.send(null);
    }
    catch (e) {
      then(false);
    }
  }

  async handleFiles(file) {
    var input = file.target;
    var reader = new FileReader();
    reader.onload = async function () {
      var dataURL = reader.result;
      let d = new Timestamp();
      let pwd = await cryptography.getChatPwd();
      for (let i = 0; i < window.localDB.chats.length; i++) {
        if (localDB.chats[i].name === viewingChat) {
          pwd = await cryptography.decrypt(localDB.chats[i].key, localDB.usrPwd);
          break;
        }
      }
      let msgPush = new MsgPush(
        dataURL,
        await getViewingChatMail(),
        d,
        pwd,
        "img"
      );
      firebase.database().ref("msg").push().set(msgPush);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
