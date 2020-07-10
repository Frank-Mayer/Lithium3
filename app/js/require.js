"use strict";

function requireJS(srcs) {
  for (let src of srcs) {
    let script = document.createElement('script');
    script.setAttribute("async", "async");
    script.src = "./js/" + src;
    document.head.appendChild(script);
  }
}

function requireExternalJS(srcs) {
  for (let src of srcs) {
    let script = document.createElement('script');
    script.src = "https://" + src;
    document.head.appendChild(script);
  }
}

function requireCSS(srcs) {
  for (let src of srcs) {
    let css = document.createElement('link');
    css.setAttribute("async", "async");
    css.rel = "stylesheet";
    css.href = "./css/" + src;
    document.head.appendChild(css);
  }
}