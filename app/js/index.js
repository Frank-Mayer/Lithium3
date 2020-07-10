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
    requireCSS(["alert.css", "select.css"]);

    requireJS(["aes.js", "aes-ctr.js"]);

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

  requireJS(["BigInteger.min.js",
    "qrcode.min.js",
    "math.js",
    "emoji.js",
    "diffiehellman.js",
  ]);

  requireCSS(["emoji.css",
    "chatsList.css",
    "chats.css",
    "qr.css"
  ]);
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