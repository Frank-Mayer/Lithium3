"use strict";
class MsgPush {
  constructor(newTxt, receiver, d, pwd, type) {
    this.sender = localDB.email;
    this.receiver = receiver;
    this.text = cryptography.encrypt(newTxt, pwd);
    this.timestamp = cryptography.encrypt(d.dateToTimestamp(), pwd);
    if (type) {
      this.type = type;
    }
    this.read = false;
  }
};