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
    let x = await this.sha512(str + this.salt);
    let y = await this.sha512(x);
    return y;
  }

  async pwdHash(str) {
    let x = await this.sha512(str + this.salt);
    let y = await this.sha512(x);
    let z = await this.sha512(y);
    return z;
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

  async handleFiles(fInput) {
    let files = fInput.files;
    console.log(files)

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      console.log(file)
      let reader = new FileReader();
      reader.onload = (async function () {
        return async function (e) {
          console.log(String(e.target.result));
          // let meep = await AesCtr.encrypt(String(e.target.result), String("Meep"), 128);
          // let meep2 = await AesCtr.decrypt(meep, String("Meep"), 128)
          // document.getElementById("p1").innerText = e.target.result;
          // document.getElementById("p2").innerText = meep;
          // document.getElementById("p3").innerText = meep2;
          // document.getElementById("img").src = meep2;
        };
      })();
      reader.readAsDataURL(file);
    }
  }
}
