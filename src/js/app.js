'use strict';

console.log('app loaded');

define([

], function () {

  console.log('app exec');

  var App = function () {

    console.log(Backbone);

    this.models = {};
    this.collections = {};
    this.views = {};
    this.routers = {};

  };

  return App;

});
