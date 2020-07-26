"use strict";

class UserEvents {
  constructor() {
    try {
      document.getElementById("msgSendButton").addEventListener("click", async function () {
        if (msgText.value.length > 0) {
          let d = new Timestamp();
          let newTxt = msgText.value;
          let pwd = cryptography.getChatPwd();
          for (let i = 0; i < localDB.chats.length; i++) {
            if (localDB.chats[i].name === viewingChat) {
              pwd = cryptography.decrypt(localDB.chats[i].key, localDB.usrPwd);
              break;
            }
          }
          let msgPush = new MsgPush(
            newTxt,
            await getViewingChatMail(),
            d,
            pwd
          );
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
        document.getElementById("connectHashTxt").value = 'This could take a view Seconds';
        ui.openQr();
        setTimeout(async () => { await diffiehellman.init(); }, 1500);
      });


      document.getElementById("fileUpload").addEventListener("input", (event) => {
        cryptography.handleFiles(event);
      });

      document.getElementById("fUploadButton").addEventListener("click", () => {
        document.getElementById("fileUpload").click();
      });

      document.getElementById("visPwd").addEventListener("click", ui.togglePwd);

      document.getElementById("qrCloseBtn").addEventListener("click", ui.closeQr);

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

      document.getElementById("userName").addEventListener("input", () => {
        userEvents.regUsrUpdate();
      });

      document.getElementById("password").addEventListener("input", () => {
        userEvents.regPwdUpdate();
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
      for (let i in usrName) {
        let char = usrName[i];
        if (!database.allowedCharacters.includes(char)) {
          valid = false;
          invalidChar = char;
          break;
        }
      }
      if (valid) {
        usrNamErrorSpan.classList.remove("error");
        usrNamErrorSpan.innerText = "Username";
      }
      else {
        usrNamErrorSpan.classList.add("error");
        usrNamErrorSpan.innerText = `Invalid character ${invalidChar}`;
      }
    }
    else {
      usrNamErrorSpan.classList.remove("error");
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
    try {
      ui.registerPwdErrorReset();
    }
    finally {
      pwdCache = "";
    }
  }
}, 200);