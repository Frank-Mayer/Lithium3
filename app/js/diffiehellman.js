"use strict";

var diffiehellman = new class {
  listener = void (0);
  async init() {
    try {
      let crRand = new Uint8Array(3);
      window.crypto.getRandomValues(crRand);
      let g = await Math.nthPrime(BigInt(
        Math.ceil((crRand[0] / 255) * 15)
      ));
      let rand = Math.ceil((crRand[1] / 255) * 5);
      let n = await Math.getHugePrime(rand);
      let a = BigInt(Math.ceil(((crRand[2] / 255) * 64) + 1));
      let pa = await bigInt(g).modPow(a, n);
      let exchange = cryptography.generateDBKey();
      let publicObject = {
        "g": g,
        "n": n,
        "a": pa.toString(),
        "exchange": exchange,
        "partner": localDB.usrNam
      };
      await ui.drawQrCode(btoa(JSON.stringify(publicObject)));
      this.listener = firebase.database().ref("dhKeyExchange/");
      this.listener.on("child_added", async (snapshot) => {
        if (snapshot.key === exchange) {
          let b = BigInt(snapshot.val().b);
          let key = (await bigInt(b).modPow(a, n)).toString();
          let partner = await cryptography.decrypt(snapshot.val().partner, key);
          firebase.database().ref("usrData/" + localDB.usrNam + "/chats").push().set({
            "name": await cryptography.encrypt(partner, localDB.usrPwd),
            "key": await cryptography.encrypt(key, localDB.usrPwd)
          });
          this.listener.off();
          this.listener = void (0);
          firebase.database().ref("dhKeyExchange/" + exchange).remove()
            .then(function () {
              console.log("Remove succeeded.")
            })
            .catch(function (error) {
              console.log("Remove failed: " + error.message)
            });
        }
      });
    }
    finally {
      return;
    }
  }
}