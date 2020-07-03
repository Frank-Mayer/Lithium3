"use strict";

var app = void (0);
var features = void (0);
try {
  app = firebase.app();
  features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
  console.log(`Firebase SDK loaded with ${features.join(', ')}`);
} catch (e) {
  console.error(e);
}