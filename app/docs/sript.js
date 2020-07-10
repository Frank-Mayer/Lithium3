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
    content[i].classList.add("content");
    for (let i = 0; i < content.length; i++) {
      if (index !== i) {
        content[i].classList.add("invis");
      }
    }
    setHash(index);
  }
  let b1 = document.getElementsByClassName("b1");
  let b2 = document.getElementsByClassName("b2");
  let b3 = document.getElementsByClassName("b3");
  for (let i = 0; i < b1.length; i++) {
    b1[i].addEventListener("click", () => {
      tab(0);
    });
  }
  for (let i = 0; i < b2.length; i++) {
    b2[i].addEventListener("click", () => {
      tab(1)
    });
  }
  for (let i = 0; i < b3.length; i++) {
    b3[i].addEventListener("click", () => {
      tab(2)
    });
  }
  let hash = Number(location.hash.substr(1));
  if (hash >= 0 && hash <= 3) {
    tab(hash)
  }
}

function scr(id) {
  document.getElementById(id).scrollIntoView(true);
}

function setHash(str) {
  if (history.pushState) {
    history.pushState(null, null, '#' + str);
  }
  else {
    location.hash = '#' + str;
  }
}