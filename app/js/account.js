"use strict";

var account = new class {
  async login() {
    try {
      let userName = document.getElementById("userName").value;
      let pwd = document.getElementById("password").value;
      let h = await cryptography.getHash(userName + pwd);
      // let email = userName + '@lithium-03.firebaseio.com';
      let email = await cryptography.getHash(userName);
      await firebase.auth().signInWithEmailAndPassword(email, h).catch(function (error) {
        ui.loginError();
        alert(error.message, true);
      });
      let snapshot = await firebase.database().ref('usrHash/' + userName).once('value');
      if (h === snapshot.val()) {
        localDB = { "usrNam": userName, "usrPwd": await cryptography.pwdHash(pwd + userName), "msg": [] };
        init();
      }
      else {
        ui.loginError();
      }
    }
    catch (e) {
      ui.loginError();
    }
  }

  async register() {
    let userName = document.getElementById("userName").value;
    let pwd = document.getElementById("password").value;
    let h = await cryptography.getHash(userName + pwd);
    let email = userName + '@lithium-03.firebaseio.com';
    await firebase.auth().createUserWithEmailAndPassword(email, h).catch(function (error) {
      alert(error.message, true);
      ui.loginError();
    });
    await firebase.auth().signInWithEmailAndPassword(email, h).catch(function (error) {
      alert(error.message, true);
      ui.loginError();
    });

    let snapshot = await firebase.database().ref('usrHash/' + userName).once('value');
    if (snapshot.val() === null) {
      firebase.database().ref("usrHash").child(userName).set(h);
      firebase.database().ref("usrData").child(userName).set({
        "chats": new Object(),
        "img": database.defaultImg
      });
      localDB = { "usrNam": userName, "usrPwd": await cryptography.pwdHash(pwd + userName), "msg": [] };
      init();
    }
    else {
      ui.loginError();
    }
  }
}