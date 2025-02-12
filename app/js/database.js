"use strict";

var database = new class {
  loginTime = -1;

  constructor() {
    let d = new Timestamp();
    this.loginTime = d.dateToTimestamp();
  }

  allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!\"§\\&()=?ßẞ,;:-_@öäüÖÄÜ*'+^°"


  msgLoader = void (0);
  defaultImg = 'default.png';

  async createChatList() {
    let newChatHtmlList = new Array();
    if (localDB.chats) {
      chats.innerHTML = "";
      for (let key in localDB.chats) {
        let el = localDB.chats[key];
        el.name = await cryptography.decrypt(el.name, localDB.usrPwd);
        let snapshot = await firebase.database().ref('usrData/' + el.name).once('value');
        let newChatHtml = document.createElement("div");
        newChatHtml.classList.add("chatList");
        let img = document.createElement("img");
        img.src = './img/0.png';
        img.style.backgroundImage = `url(${await this.getFileUrl(snapshot.val().img)})`;
        img.alt = snapshot.key;
        let b = document.createElement("b");
        b.innerText = snapshot.key;
        newChatHtml.appendChild(img);
        newChatHtml.appendChild(b);
        let newOpenChatObj = {
          "name": snapshot.key
        }
        newChatHtml.setAttribute("onclick", 'ui.openChat(' + JSON.stringify(newOpenChatObj) + ')');
        newChatHtml.id = "chat_" + snapshot.key;
        newChatHtmlList.push(newChatHtml);
      }
      ui.drawChatList(newChatHtmlList);
    }
  }

  getFileUrl(filename) {
    return new Promise((resolve, reject) => {
      let storage = firebase.storage().ref(filename);
      storage
        .getDownloadURL()
        .then(function (url) {
          resolve(url);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  startMsgLoader() {
    try {
      this.msgLoader = firebase.database().ref("msg").on("child_added", async (snapshot) => {
        if (snapshot.val().receiver === localDB.email || snapshot.val().sender === localDB.email) {
          if (snapshot.val().receiver === localDB.usrNam && snapshot.val().read === false) {
            this.setRead(snapshot);
            if (viewingChat !== snapshot.val().sender) {
              notify.show(snapshot.val());
              try {
                document.getElementById("chat_" + snapshot.val().sender).classList.add("nofification");
              }
              catch (e) {
                setTimeout(() => {
                  try {
                    document.getElementById("chat_" + snapshot.val().sender).classList.add("nofification");
                  } catch (er) { }
                }, 4000);
              }
            }
          }
          let newMsgDrawData;
          // let d = new Timestamp();
          // let nowTime = d.dateToTimestamp();

          // if (snapshot.val().timestamp > nowTime - 100000000000) {
          newMsgDrawData = snapshot.val();
          newMsgDrawData["key"] = snapshot.key;
          localDB["msg"].push(newMsgDrawData);
          // }
          // else {
          //   console.log("deleting old msg...")
          //   firebase.database().ref("msg").child(snapshot.key).remove()
          //     .then(function () {
          //       console.log("Remove succeeded.")
          //     })
          //     .catch(function (error) {
          //       console.log("Remove failed: " + error.message)
          //     });
          // }
          let rec = newMsgDrawData.receiver;
          let send = newMsgDrawData.sender;
          let viewCh = await getViewingChatMail();

          if (newMsgDrawData.receiver === await getViewingChatMail() || newMsgDrawData.sender === await getViewingChatMail()) {
            ui.drawMsg(newMsgDrawData);
          }
          else {
            if (String(newMsgDrawData.sender) !== String(localDB.email)) {
              let sender = await account.getUsernameFromMail(newMsgDrawData.sender);
              let pwd = await cryptography.getChatPwd(sender);
              let ts = await cryptography.decrypt(newMsgDrawData.timestamp, pwd);
              if (ts > this.loginTime) {
                notify.show(newMsgDrawData);
              }
            }
          }
        }
      });
    }
    catch (e) {
      console.error(e);
    }
  }

  stopMsgLoader() {
    try {
      firebase.database().ref("msg").off("child_added", this.msgLoader);
      this.msgLoader = void (0);
    }
    catch (e) {
      console.error("msgLoader not started");
    }
    finally {
      console.warn("MsgListener turned off");
    }
  }

  setRead(snapshot) {
    let data = snapshot.val();
    data["read"] = true;
    firebase.database().ref("msg/" + snapshot.key).set(data);
  }

  async createChat(data) {
    await require("./js/BigInteger.min.js");
    let crRand = new Uint8Array(1);
    window.crypto.getRandomValues(crRand);
    let exchange = data.exchange;
    let partner = data.partner;
    let g = bigInt(data.g);
    let n = bigInt(data.n);
    let a = bigInt(data.a);
    let b = bigInt(Math.ceil(((crRand[0] / 255) * 64) + 1));
    let pb = await bigInt(g).modPow(b, n);
    let key = (await bigInt(a).modPow(b, n)).toString();
    firebase.database().ref("dhKeyExchange/" + exchange).update({
      "b": pb.toString(),
      "partner": await cryptography.encrypt(localDB.usrNam, key)
    });
    firebase.database().ref("usrData/" + localDB.usrNam + "/chats").push().set({
      "name": await cryptography.encrypt(partner, localDB.usrPwd),
      "key": await cryptography.encrypt(key, localDB.usrPwd)
    });
  }

  async getChatKey() {
    let chatKey = new Array();
    chatKey.push(String(account.getUserHashForDB()))
    chatKey.push(String(await cryptography.getHash(viewingChat)));
    chatKey = chatKey.sort().join('');
    console.log(JSON.stringify(chatKey));
    return String(chatKey);
  }

  async updateSettings() {
    let img = await firebase.database().ref(`usrData/${localDB.usrNam}/img`).once('value');
    document.getElementById("myImg").src = await this.getFileUrl(img.val());
  }

  async uploadNewImg() {
    let input = document.createElement("input");
    input.style.display = "none";
    input.type = "file";
    input.accept = "img/*";
    document.body.appendChild(input);
    input.addEventListener("input", (e) => {
      let file = e.target.files[0];
      let fileExt = (file.name.split(".").slice(-1)[0]).toLowerCase();
      if (fileExt !== "jpg" && fileExt !== "png" && fileExt !== "gif") {
        alert("File format not supported", true);
        return;
      }
      let fileName = localDB.usrNam + "." + fileExt;
      console.log(fileName);
      let storage = firebase.storage().ref(fileName);
      let upload = storage.put(file);
      upload.on(
        "state_changed",
        function progress(snapshot) {
          var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(percentage);
        },
        function error(e) {
          console.error(e);
          alert("error uploading file", true);
        },
        function complete() {
          console.log(`${fileName} upoaded`);
          firebase.database().ref(`usrData/${localDB.usrNam}/img`).set(fileName).then(() => {
            database.updateSettings();
          })
        }
      );
      input.remove();
    });
    input.click();
  }
}