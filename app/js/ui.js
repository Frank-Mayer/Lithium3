"use strict";

class Ui {
  chatHistory = void (0);
  chats = void (0);
  chatsView = void (0);
  chatname = void (0);
  drawMsgHistory = [];

  constructor() {
    this.chatHistory = document.getElementById("chatHistory");
    this.chats = document.getElementById("chats");
    this.chatsView = document.getElementById("chatsView");
    this.chatname = document.getElementById("chatname");
  }

  drawChatList(newChatList) {
    chats.innerHTML = "";
    newChatList.forEach(el => {
      chats.appendChild(el);
    });
  }

  openChat(user) {
    try {
      document.getElementById("chat_" + user.name).classList = "chatList";
      chatHistory.innerHTML = "";
      viewingChat = user.name;
      localDB.msg.forEach(el => {
        if (el.receiver === viewingChat || el.sender === viewingChat) {
          this.drawMsg(el);
        }
      });
      chatsView.classList = "chats layer2";
      chatname.innerHTML = String(user.name);
      chat.style.setProperty("top", "16px");
    }
    catch (e) {
      console.error(e);
    }
  }

  closeChat() {
    chatHistory.innerHTML = "";
    viewingChat = "";
    chatsView.classList = "chats";
    chat.style.setProperty("top", "calc(100% + 50px)");
    this.drawMsgHistory = new Array();
  }

  openQr() {
    chatsView.classList = "chats layer2";
    document.getElementById("qrScan").style.setProperty("top", "16px");

  }

  closeQr() {
    chatsView.classList = "chats";
    document.getElementById("qrScan").style.setProperty("top", "calc(100% + 50px)");
  }

  drawMsg(drawInfo) {
    let msgId = drawInfo.sender + drawInfo.timestamp;
    if (this.drawMsgHistory.includes(msgId)) {
      return;
    }
    this.drawMsgHistory.push(msgId);
    let newChatText = document.createElement("div");
    let newChatTextInner = document.createElement("div");
    let pwd = cryptography.getChatPwd();
    let newText = cryptography.decrypt(drawInfo.text, pwd);
    let tempDiv = document.createElement("div");
    tempDiv.innerText = newText;
    newChatTextInner.innerHTML = emoji.replace(tempDiv.innerHTML);
    tempDiv.remove();
    newChatText.classList = "chatMessage " + (drawInfo.sender === localDB.usrNam ? "out" : "in");
    newChatText.id = drawInfo.key;
    let newChatTextEl = chatHistory.appendChild(newChatText);
    let dateTimeEl = document.createElement("span");
    dateTimeEl.innerHTML = drawInfo.timestamp;
    newChatTextInner.appendChild(dateTimeEl);
    newChatTextEl.appendChild(newChatTextInner);
    newChatTextEl.scrollIntoView();
  }

  loginError(msg = "Error") {
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.innerHTML = String(msg);
    loginBtn.classList = "error";
    setTimeout(() => {
      loginBtn.innerHTML = register ? "Register" : "Login";
      loginBtn.classList = "";
    }, 1500);
  }

  registerPwdError(e) {
    loginBtn.disabled = true;
    document.getElementById("pwdErrorSpan").innerText = e;
    document.getElementById("password").classList = "error";
    document.getElementById("pwdErrorSpan").classList = "error";
  }

  registerPwdErrorReset() {
    loginBtn.disabled = false;
    document.getElementById("pwdErrorSpan").innerText = "Password";
    document.getElementById("password").classList = "";
    document.getElementById("pwdErrorSpan").classList = "";
  }

  registerPwdProcess() {
    loginBtn.disabled = true;
    document.getElementById("pwdErrorSpan").innerText = "Processing...";
    document.getElementById("password").classList = "";
    document.getElementById("pwdErrorSpan").classList = "";
  }

  drawQrCode(str) {
    let codeSize = window.innerWidth;
    if (window.innerHeight < codeSize) {
      codeSize = (window.innerHeight / 2);
    }
    codeSize -= 48;
    let qrCode = document.getElementById("qrCode");
    qrCode.style.width = String(codeSize) + "px";
    qrCode.style.height = String(codeSize) + "px";
    qrCode.style.marginLeft = 'calc(50% - ' + String((codeSize + 16) / 2) + 'px)';
    qrCode.style.marginRight = 'calc(50% - ' + String((codeSize + 16) / 2) + 'px)';
    let qrCodeImg = new QRCode("qrCode", {
      text: 'https://lithium3.web.app#' + str,
      width: codeSize,
      height: codeSize,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    document.getElementById("qrCode").style.visibility = "visible";
    document.getElementById("connectHashTxt").value = str;
  }

  alert(str, error = false) {
    let msg = document.createElement("div");
    msg.innerText = String(str);
    msg.id = "alert";
    let alert = document.body.appendChild(msg)
    if (error) {
      alert.classList = "error";
    }
    setTimeout(() => {
      alert.classList = "remove" + (error ? " error" : "");
      setTimeout(() => {
        alert.remove();
      }, 500);
    }, 3000);
  }
}