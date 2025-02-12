"use strict";

class Ui {
  chatHistory = void (0);
  chats = void (0);
  chatsView = void (0);
  chatname = void (0);
  drawMsgHistory = new Array();

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

  async openChat(user) {
    try {
      this.drawMsgHistory = new Array();
      document.getElementById("chat_" + user.name).classList.remove("nofification");
      chatHistory.innerHTML = "";
      viewingChat = user.name;
      await getViewingChatMail();
      localDB.msg.forEach(el => {
        if (el.receiver === viewingChatMail || el.sender === viewingChatMail) {
          this.drawMsg(el);
        }
      });
      chatsView.classList.add("layer2");
      chatname.innerHTML = String(user.name);
      chat.style.setProperty("top", "16px");
      document.getElementById("msgText").focus();
    }
    catch (e) {
      console.error(e);
    }
  }

  closeChat() {
    chatHistory.innerHTML = "";
    viewingChat = "";
    chatsView.classList.remove("layer2");
    chat.style.setProperty("top", "calc(100% + 50px)");
    this.drawMsgHistory = new Array();
  }

  openQr() {
    chatsView.classList.add("layer2");
    document.getElementById("qrScan").style.setProperty("top", "16px");
  }

  closeQr() {
    chatsView.classList.remove("layer2");
    document.getElementById("qrScan").style.setProperty("top", "calc(100% + 50px)");
    // diffiehellman.listener.off();
  }

  async drawMsg(drawInfo) {
    let pwd = cryptography.getChatPwd();
    let ts = new Timestamp();
    ts.timestampToDate(await cryptography.decrypt(drawInfo.timestamp, pwd));
    let msgId = drawInfo.sender + drawInfo.timestamp;
    if (this.drawMsgHistory.includes(msgId)) {
      return;
    }
    this.drawMsgHistory.push(msgId);
    let newChatText = document.createElement("div");
    let newChatTextInner = document.createElement("div");
    let newText = cryptography.decrypt(drawInfo.text, pwd);
    let tempDiv = document.createElement("div");
    if ("type" in drawInfo) {
      switch (drawInfo.type) {
        case "txt":
          tempDiv.innerText = newText;
          break;
        case "img":
          let imgPrev = document.createElement("img");
          imgPrev.src = newText;
          imgPrev.classList.add("upload");
          tempDiv.appendChild(imgPrev);
          break;
      }
    }
    else {
      tempDiv.innerText = newText;
    }
    newChatTextInner.innerHTML = emoji.replace(tempDiv.innerHTML);
    tempDiv.remove();
    newChatText.classList.add("chatMessage", (drawInfo.sender === localDB.email ? "out" : "in"));
    newChatText.id = drawInfo.key;
    let newChatTextEl = chatHistory.appendChild(newChatText);
    let dateTimeEl = document.createElement("span");
    dateTimeEl.innerHTML = ts.toString();
    newChatTextInner.appendChild(dateTimeEl);
    newChatTextEl.appendChild(newChatTextInner);
    newChatTextEl.scrollIntoView();
  }

  loginError(msg = "Error") {
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.innerHTML = String(msg);
    loginBtn.classList.add("error");
    setTimeout(() => {
      loginBtn.innerHTML = register ? "Register" : "Login";
      loginBtn.classList.remove("error");
    }, 1500);
  }

  registerPwdError(e) {
    loginBtn.disabled = true;
    document.getElementById("pwdErrorSpan").innerText = e;
    document.getElementById("password").classList.add("error");
    document.getElementById("pwdErrorSpan").classList.add("error");
  }

  registerPwdErrorReset() {
    loginBtn.disabled = false;
    document.getElementById("pwdErrorSpan").innerText = "Password";
    document.getElementById("password").classList.remove("error");
    document.getElementById("pwdErrorSpan").classList.remove("error");
  }

  registerPwdProcess() {
    loginBtn.disabled = true;
    document.getElementById("pwdErrorSpan").innerText = "Processing...";
    document.getElementById("password").classList.remove("error");
    document.getElementById("pwdErrorSpan").classList.remove("error");
  }

  drawQrCode(str) {
    let data = 'https://lithium3.web.app#' + str;
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
      text: data,
      width: codeSize,
      height: codeSize,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    document.getElementById("qrCode").style.visibility = "visible";
    document.getElementById("connectHashTxt").value = data;
  }

  alert(str, error = false) {
    let msg = document.createElement("div");
    msg.innerText = String(str);
    msg.id = "alert";
    let alert = document.body.appendChild(msg)
    if (error) {
      alert.classList.add("error");
    }
    setTimeout(() => {
      alert.classList.add("remove");
      setTimeout(() => {
        alert.remove();
      }, 500);
    }, 3000);
  }

  togglePwd() {
    let pwd = document.getElementById("password");
    pwd.setAttribute("type", (pwd.getAttribute("type") === "password" ? "text" : "password"));
  }
}