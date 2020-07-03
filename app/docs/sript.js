"use strict";

if (String(document.readyState) !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    main();
  });
}

function main() {
  function hideAll() {
    let content = document.getElementsByClassName("content")
    for (let i = 0; i < content.length; i++) {
      content[i].style.opacity = "0"
    }
  }
  document.getElementById("b1").addEventListener("click", () => {
    hideAll();
    document.getElementById("p1").style.opacity = "1";
  });
  document.getElementById("b2").addEventListener("click", () => {
    hideAll();
    document.getElementById("p2").style.opacity = "1";
  });
  document.getElementById("b3").addEventListener("click", () => {
    hideAll();
    document.getElementById("p3").style.opacity = "1";
  });
  hideAll();
  document.getElementById("p1").style.opacity = "1";
}