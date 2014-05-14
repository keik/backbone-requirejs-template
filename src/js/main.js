'use strict';

console.log('main loaded');

require([
  'app',
  'backbone'
], function (App) {

  console.log('main exec');

  window.app = window.app || new App();

});
