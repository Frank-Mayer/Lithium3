"use strict";

if (String(document.readyState) !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    main();
  });
}

function main() {
  function tab(index) {
    let content = document.getElementsByClassName("content")
    for (let i = 0; i < content.length; i++) {
      content[i].classList = (index === i ? "content" : "content invis");
    }
  }
  document.getElementById("b1").addEventListener("click", () => {
    tab(0)
  });
  document.getElementById("b2").addEventListener("click", () => {
    tab(1)
  });
  document.getElementById("b3").addEventListener("click", () => {
    tab(2)
  });
  tab(1);
}

function scr(id) {
  document.getElementById(id).scrollIntoView(true);
}