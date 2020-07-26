"use strict";

class WatchDog {
  constructor() {
    if (window.self !== window.top) {
      window.location.href = "./405.html";
      throw "fatal error";
    }
    else {
      let embed = document.createElement("iframe");
      embed.src = `./app.html${window.location.hash}`;
      document.body.appendChild(embed);
    }
  }
}

let wd = new WatchDog();