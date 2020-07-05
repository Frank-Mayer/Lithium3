"use strict";

class Timestamp {
  date = new Object();

  dateToTimestamp() {
    return Number(
      this.date.getFullYear().toString().padStart(4, "0") +
        (this.date.getMonth() + 1).toString().padStart(2, "0") +
        this.date.getDate().toString().padStart(2, "0") +
        this.date.getHours().toString().padStart(2, "0") +
        this.date.getMinutes().toString().padStart(2, "0") +
        this.date.getSeconds().toString().padStart(2, "0") +
        this.date.getMilliseconds().toString().padStart(3, "0")
    );
  }

  timestampToDate(foo) {
    foo = String(foo);
    this.date.setFullYear = Number(foo.substr(0, 4));
    this.date.setMonth = Number(foo.substr(4, 2)) - 1;
    this.date.setDate = Number(foo.substr(6, 2));
    this.date.setHours = Number(foo.substr(8, 2));
    this.date.setMinutes = Number(foo.substr(10, 2));
    this.date.setSeconds = Number(foo.substr(12, 2));
    this.date.setMilliseconds = Number(foo.substr(14, 3));
  }

  toString() {
    return String(
        String(this.date.getHours()).padStart(2, "0") +
        ":" +
        String(this.date.getMinutes()).padStart(2, "0") +
        ":" +
        String(this.date.getSeconds()).padStart(2, "0")
    );
  }
}
