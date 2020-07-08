"use strict";

class Notify {
  constructor() {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
      });
    }
    window.alert = ui.alert;
    Window.prototype.alert = ui.alert;
  }
  async show(data) {
    let sender = await account.getUsernameFromMail(data.sender);
    let pwd = await cryptography.getChatPwd(sender);
    if (Notification.permission === 'denied') {
      alert(cryptography.decrypt(data.text, pwd))
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
      });
    }
    let notification = new Notification(sender, {
      "body": cryptography.decrypt(data.text, pwd)
    });
  }
}