"use strict";

var account = new class {
  async login() {
    try {
      let userName = document.getElementById("userName").value;
      let pwd = document.getElementById("password").value;
      let h = await cryptography.getHash(userName + pwd);
      let email = userName + '@lithium-03.firebaseio.com';
      await firebase.auth().signInWithEmailAndPassword(email, h).catch(function (error) {
        throw error.message;
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
    catch (error) {
      alert(error, true);
      ui.loginError();
    }
  }

  async register() {
    try {
      let userName = document.getElementById("userName").value;
      let pwd = document.getElementById("password").value;
      let h = await cryptography.getHash(userName + pwd);
      let email = userName + '@lithium-03.firebaseio.com';
      await firebase.auth().createUserWithEmailAndPassword(email, h).catch(function (error) {
        throw error.message;
      });
      await firebase.auth().signInWithEmailAndPassword(email, h).catch(function (error) {
        throw error.message;
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
        ui.loginError("Username not available");
      }
    }
    catch (error) {
      alert(error, true);
      ui.loginError();
    }
  }
}