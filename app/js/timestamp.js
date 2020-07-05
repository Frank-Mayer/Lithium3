"use strict";

class Timestamp extends Date {

  dateToTimestamp() {
    return Number(
      this.getFullYear().toString().padStart(4, "0") +
        (this.getMonth() + 1).toString().padStart(2, "0") +
        this.getDate().toString().padStart(2, "0") +
        this.getHours().toString().padStart(2, "0") +
        this.getMinutes().toString().padStart(2, "0") +
        this.getSeconds().toString().padStart(2, "0") +
        this.getMilliseconds().toString().padStart(3, "0")
    );
  }

  timestampToDate(foo) {
    foo = String(foo);
    this.setFullYear(Number(foo.substr(0, 4)));
    this.setMonth(Number(foo.substr(4, 2)) - 1);
    this.setDate(Number(foo.substr(6, 2)));
    this.setHours(Number(foo.substr(8, 2)));
    this.setMinutes(Number(foo.substr(10, 2)));
    this.setSeconds(Number(foo.substr(12, 2)));
    this.setMilliseconds(Number(foo.substr(14, 3)));
  }

  toString() {
    return String(
        String(this.getHours()).padStart(2, "0") +
        ":" +
        String(this.getMinutes()).padStart(2, "0") +
        ":" +
        String(this.getSeconds()).padStart(2, "0")
    );
  }
}
