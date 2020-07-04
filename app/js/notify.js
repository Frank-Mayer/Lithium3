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
  show(data) {
    if (Notification.permission === 'denied') {
      alert(cryptography.decrypt(data.text, cryptography.getChatPwd(data.sender)))
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
      });
    }
    let notification = new Notification(data.sender, {
      "body": cryptography.decrypt(data.text, cryptography.getChatPwd(data.sender))
    });
  }
}