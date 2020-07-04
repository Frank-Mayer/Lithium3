"use strict";

var userEvents = new class {
  constructor() {
    try {
      document.getElementById("msgSendButton").addEventListener("click", function () {
        if (msgText.value.length > 0) {
          let d = new Date();
          let newTxt = msgText.value;
          let pwd = cryptography.getChatPwd();
          for (let i = 0; i < localDB.chats.length; i++) {
            if (localDB.chats[i].name === viewingChat) {
              pwd = cryptography.decrypt(localDB.chats[i].key, localDB.usrPwd);
              break;
            }
          }
          let msgPush = {
            "sender": localDB.usrNam,
            "receiver": viewingChat,
            "text": cryptography.encrypt(newTxt, pwd),
            "timestamp": (d.getFullYear().toString().padStart(4, "0")) + ((d.getMonth() + 1).toString().padStart(2, "0")) + (d.getDate().toString().padStart(2, "0")) + (d.getHours().toString().padStart(2, "0")) + (d.getMinutes().toString().padStart(2, "0")) + (d.getSeconds().toString().padStart(2, "0")) + (d.getMilliseconds().toString().padStart(3, "0")),
            "read": false
          };
          firebase.database().ref("msg").push().set(msgPush);
          msgText.value = "";
        }
      });

      document.addEventListener('keyup', (event) => {
        if (String(event.key) === "Enter") {
          let loginBtn = document.getElementById("loginBtn");
          if (loginBtn) {
            loginBtn.click();
          }
          else if (viewingChat.length > 0 && window.screen.width > window.screen.height && !event.shiftKey) {
            document.getElementById("msgSendButton").click();
          }
        }
      }, false);

      document.getElementById("qrButton").addEventListener("click", async () => {
        document.getElementById("qrCode").style.visibility = "hidden";
        document.getElementById("connectHashTxt").value = 'Generating...';
        ui.openQr();
        setTimeout(async () => { await diffiehellman.init(); }, 1500);
      });

      document.getElementById("qrCloseBtn").addEventListener("click", ui.closeQr)

      document.getElementById("chatname").addEventListener("click", ui.closeChat);

      document.getElementById("closeChat").addEventListener("click", ui.closeChat);

      document.getElementById("createAccount").addEventListener("click", function () {
        register = !register;
        document.getElementById("loginBtn").innerHTML = register ? "Register" : "Login";
        document.getElementById("createAccount").innerHTML = register ? "I already have an account" : "Create new accound";
      });

      document.getElementById("connectHashTxt").addEventListener("click", () => {
        var copyText = document.getElementById("connectHashTxt");
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");
      });
    }
    catch (e) {
      console.error(e);
    }
  }

  async regPwdUpdate() {
    pwdChangeTimeCache = new Date();
    if (register) {
      ui.registerPwdProcess();
    }
    else {
      ui.registerPwdErrorReset();
    }
  }

  async regUsrUpdate() {
    if (register) {
      let usrNamErrorSpan = document.getElementById("usrNamErrorSpan");
      let userName = document.getElementById("userName");
      let usrName = userName.value;
      let valid = true;
      let invalidChar = '\0';
      console.clear();
      console.log(usrName);
      for (let i in usrName) {
        let char = usrName[i];
        console.log(char)
        if (!database.allowedCharacters.includes(char)) {
          valid = false;
          invalidChar = char;
          break;
        }
      }
      if (valid) {
        usrNamErrorSpan.classList = "";
        usrNamErrorSpan.innerText = "Username";
      }
      else {
        usrNamErrorSpan.classList = "error";
        usrNamErrorSpan.innerText = "Invalid character " + invalidChar;
      }
    }
    else {
      usrNamErrorSpan.classList = "";
      usrNamErrorSpan.innerText = "Username";
    }
  }
}


var pwdChangeTimeCache = new Date();
var pwdCache = "";
var registerPasswordCheckInterval = setInterval(async function () {
  let pwdEl = document.getElementById("password");
  let pwdErrorSpan = document.getElementById("pwdErrorSpan");
  if (register) {
    let tempTime = new Date();
    let seconds = (tempTime.getTime() - pwdChangeTimeCache.getTime()) / 1000;
    if (seconds >= 1.5) {
      if (pwdEl.value.length >= 8) {
        let newPwdCache = await cryptography.digestStr(pwdEl.value);
        if (newPwdCache !== pwdCache) {
          pwdCache = newPwdCache;
          cryptography.isPasswordLeaked(newPwdCache, function (x) {
            if (x) {
              ui.registerPwdError("Password found in leaked databases");
            }
            else {
              ui.registerPwdErrorReset();
            }
          });
        }
      }
      else {
        ui.registerPwdError("Password too short, at least 8 characters");
      }
    }
  }
  else {
    pwdCache = "";
    ui.registerPwdErrorReset();
  }
}, 200);