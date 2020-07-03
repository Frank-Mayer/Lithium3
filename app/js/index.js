"use strict";

var localDB = void (0);
var ui = void (0);
var notify = void (0);
var viewingChat = "";
var register = false;
if (String(document.readyState) !== 'loading') {
  onContentLoaded();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    onContentLoaded();
  });
}

function onContentLoaded() {
  try {
    ui = new Ui();
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
      finally {
        loginBtn.disabled = false;
      }
    })
  } catch (e) {
    console.error(e);
  }
}

function init() {
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