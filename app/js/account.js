"use strict";

var account = new class {
  async login() {
    try {
      document.getElementById("loginControl").style.opacity = "0";
      document.getElementById("splashLoading").style.opacity = "1";
      document.getElementById("loginBtn").disabled = true;
      let userName = document.getElementById("userName").value;
      let pwd = document.getElementById("password").value;
      let h = await cryptography.getHash(userName + pwd);
      let email = await this.getMailFromUsername(userName);
      await firebase.auth().signInWithEmailAndPassword(email, h).catch(function (error) {
        throw "Login failed";
      });
      let snapshot = await firebase.database().ref('usrHash/' + userName).once('value');
      if (h === snapshot.val()) {
        localDB = {
          "usrNam": userName,
          "usrPwd": await cryptography.pwdHash(pwd + userName),
          "email": email,
          "msg": []
        };
        init();
      }
      else {
        ui.loginError();
      }
    }
    catch (error) {
      alert(error, true);
      ui.loginError();
      document.getElementById("loginBtn").disabled = false;
      document.getElementById("loginControl").style.opacity = "1";
      document.getElementById("splashLoading").style.opacity = "0";
    }
    finally {
      return;
    }
  }

  async register() {
    try {
      document.getElementById("loginControl").style.opacity = "0";
      document.getElementById("splashLoading").style.opacity = "1";
      document.getElementById("loginBtn").disabled = true;
      let userName = document.getElementById("userName").value;
      let pwd = document.getElementById("password").value;
      let h = await cryptography.getHash(userName + pwd);
      let email = await cryptography.digestStr(userName) + '@lithium-03.firebaseio.com';
      // let email = userName + '@lithium-03.firebaseio.com';
      await firebase.auth().createUserWithEmailAndPassword(email, h).catch(function (error) {
        throw "Registration failed";
      });
      await firebase.auth().signInWithEmailAndPassword(email, h).catch(function (error) {
        throw "Registration failed";
      });

      let snapshot = await firebase.database().ref('usrHash/' + userName).once('value');
      if (snapshot.val() === null) {
        firebase.database().ref("usrHash").child(userName).set(h);
        firebase.database().ref("usrData").child(userName).set({
          "chats": new Object(),
          "img": database.defaultImg
        });
        localDB = {
          "usrNam": userName,
          "usrPwd": await cryptography.pwdHash(pwd + userName),
          "email": email,
          "msg": []
        };
        init();
      }
      else {
        ui.loginError("Username not available");
      }
    }
    catch (error) {
      alert(error.replace("email address", "username"), true);
      ui.loginError();
      document.getElementById("loginBtn").disabled = false;
      document.getElementById("loginControl").style.opacity = "1";
      document.getElementById("splashLoading").style.opacity = "0";
    }
    finally {
      return;
    }
  }

  getUserHashForDB() {
    return (firebase.auth().currentUser.email.split('@')[0]);
  }

  async getUsernameFromMail(mail) {
    if (mail === localDB.email) {
      return localDB.usrNam;
    }
    for (let chat in localDB.chats) {
      let name = (localDB.chats[chat].name)
      if ((await this.getMailFromUsername(name)) === mail) {
        return name;
      }
    }
    throw ("user " + mail + " not found");
  }

  async getMailFromUsername(user) {
    return (await cryptography.digestStr(user)) + '@lithium-03.firebaseio.com';
  }

  getUid() {
    return firebase.auth().currentUser.uid;
  }
}