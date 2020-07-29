"use strict";

var localDB = void (0);
var ui = void (0);
var userEvents = void (0);
var notify = void (0);
var viewingChat = "";
var viewingChatMail = "";
var viewingChatMailHis = "invalid";
var register = false;
var initialized = false;

async function getViewingChatMail() {
  if (viewingChat !== viewingChatMailHis) {
    viewingChatMailHis = viewingChat;
    viewingChatMail = await account.getMailFromUsername(viewingChat);
  }
  return viewingChatMail;
}

if (String(document.readyState) !== 'loading') {
  onContentLoaded();
}
else {
  document.addEventListener('DOMContentLoaded', function () {
    onContentLoaded();
  });
}

function onContentLoaded() {
  try {
    ["alert.css", "select.css"].forEach((f) => {
      require("./css/" + f);
    });

    setTimeout(() => {
      document.getElementById("loginControl").style.opacity = "1";
    }, 500);

    ui = new Ui();
    userEvents = new UserEvents();
    notify = new Notify();
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.addEventListener("click", function () {
      try {
        loginBtn.disabled = true;
        if (register) {
          account.register();
        }
        else {
          account.login();
        }
      }
      catch (e) {
        loginBtn.disabled = false;
      }
    })
  } catch (e) {
    console.error(e);
  }
}

function init() {
  if (initialized) {
    return;
  }
  initialized = true;

  ["qrcode.min.js",
    "math.js",
    "emoji.js",
    "diffiehellman.js",
    "MsgPush.js"
  ].forEach((f) => {
    require("./js/" + f);
  });

  ["emoji.css",
    "chatsList.css",
    "chats.css",
    "qr.css"
  ].forEach((f) => {
    require("./css/" + f);
  });

  // fade out Login Screen
  window.setTimeout(function () {
    document.getElementById("splashScreen").style.opacity = 0;
    window.setTimeout(function () {
      document.getElementById("splashScreen").remove();
      clearInterval(registerPasswordCheckInterval);
    }, 600);
  }, 500);

  try {
    if (location.hash.length > 1) {
      let hash = JSON.parse(atob(location.hash.substr(1)));
      window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.indexOf('#')));
      database.createChat(hash);
    }
  }
  catch (e) {
    console.error(e);
  }
  // history.pushState(null, document.title, window.location.pathname);

  try {
    firebase.database().ref("usrData/" + localDB.usrNam).on("child_added", snapshot => {
      localDB[snapshot.key] = snapshot.val();
      if (snapshot.key === "chats") {
        database.createChatList();
      }
    });
  } catch (e) {
    console.error(e);
  }


  try {
    firebase.database().ref("usrData/" + localDB.usrNam).on("child_changed", snapshot => {
      localDB[snapshot.key] = snapshot.val();
      if (snapshot.key === "chats") {
        database.createChatList();
      }
    });
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    database.startMsgLoader();
  }, 200);
}