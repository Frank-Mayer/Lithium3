"use strict";

class WatchDog {
  constructor() {
    if (window.self !== window.top) {
      window.location.href = "./405.html";
      throw "fatal error";
    }
    else {
      let embed = document.createElement("embed");
      embed.src = `./app.html${window.location.hash}`;
      embed.style.position = "absolute";
      embed.style.top = "0";
      embed.style.right = "0";
      embed.style.bottom = "0";
      embed.style.left = "0";
      embed.style.width = "100vw";
      embed.style.height = "100vh";
      document.body.appendChild(embed);
    }
  }
}

let wd = new WatchDog();