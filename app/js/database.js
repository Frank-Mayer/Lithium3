"use strict";

var database = new class {
  constructor() {
    this.loginTime = -1;
  }

  allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!\"§\\&()=?ß,;:-_@öäü*'+^°"

  loginTime = -1;

  msgLoader = void (0);

  defaultImg = 'default.png?alt=media&token=78c7945d-eaea-4324-9dc7-7d8970afcb30';

  async createChatList() {
    let newChatHtmlList = new Array();
    if (localDB.chats) {
      chats.innerHTML = "";
      for (let key in localDB.chats) {
        let el = localDB.chats[key];
        el.name = await cryptography.decrypt(el.name, localDB.usrPwd);
        let snapshot = await firebase.database().ref('usrData/' + el.name).once('value');
        let newChatHtml = document.createElement("div");
        newChatHtml.classList = "chatList";
        let img = document.createElement("img");
        img.src = './img/0.png';
        img.style.backgroundImage = 'url(https://firebasestorage.googleapis.com/v0/b/lithium-03.appspot.com/o/' + snapshot.val().img + ')';
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

  startMsgLoader() {
    try {
      this.msgLoader = firebase.database().ref("msg").on("child_added", snapshot => {
        if (snapshot.val().receiver === localDB.usrNam || snapshot.val().sender === localDB.usrNam) {
          if (snapshot.val().receiver === localDB.usrNam && snapshot.val().read === false) {
            this.setRead(snapshot);
            if (viewingChat !== snapshot.val().sender) {
              notify.show(snapshot.val());
              try {
                document.getElementById("chat_" + snapshot.val().sender).classList += " nofification";
              }
              catch (e) {
                setTimeout(() => {
                  try {
                    document.getElementById("chat_" + snapshot.val().sender).classList += " nofification";
                  } catch (er) { }
                }, 4000);
              }
            }
          }
          else {
            let newMsgDrawData;
            let d = new Date();
            let nowTime = Number((d.getFullYear().toString().padStart(4, "0")) + ((d.getMonth() + 1).toString().padStart(2, "0")) + (d.getDate().toString().padStart(2, "0")) + (d.getHours().toString().padStart(2, "0")) + (d.getMinutes().toString().padStart(2, "0")) + (d.getSeconds().toString().padStart(2, "0")) + (d.getMilliseconds().toString().padStart(3, "0")));

            if (this.loginTime === -1) {
              this.loginTime = nowTime;
            }

            if (snapshot.val().timestamp > nowTime - 100000000000) {
              newMsgDrawData = snapshot.val();
              newMsgDrawData["key"] = snapshot.key;
              localDB["msg"].push(newMsgDrawData);
            }
            else {
              console.log("deleting old msg...")
              firebase.database().ref("msg").child(snapshot.key).remove()
                .then(function () {
                  console.log("Remove succeeded.")
                })
                .catch(function (error) {
                  console.log("Remove failed: " + error.message)
                });
            }

            if (newMsgDrawData.receiver === viewingChat || newMsgDrawData.sender === viewingChat) {
              ui.drawMsg(newMsgDrawData);
            }
            else {
              if (nowTime > this.loginTime) {
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
      console.error("this.msgLoader not started");
    }
    finally {
      console.warn("MsgListener turned off");
    }
  }

  setRead(snapshot) {
    let data = snapshot.val();
    data["read"] = true;
    firebase.database().ref("msg").child(snapshot.key).remove()
      .then(function () {
        firebase.database().ref("msg").push().set(data);
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });
  }

  async createChat(data) {
    let crRand = new Uint8Array(1);
    window.crypto.getRandomValues(crRand);
    let exchange = data.exchange;
    let partner = data.partner;
    let g = BigInt(data.g);
    let n = BigInt(data.n);
    let a = BigInt(data.a);
    let b = BigInt(Math.ceil(((crRand[0] / 255) * 64) + 1));
    let pb = await bigInt(g).modPow(b, n);
    let key = (await bigInt(a).modPow(b, n)).toString();
    firebase.database().ref("dhKeyExchange/" + exchange).set({
      "b": pb.toString(),
      "partner": await cryptography.encrypt(localDB.usrNam, key)
    });
    firebase.database().ref("usrData/" + localDB.usrNam + "/chats").push().set({
      "name": await cryptography.encrypt(partner, localDB.usrPwd),
      "key": await cryptography.encrypt(key, localDB.usrPwd)
    });
  }
}