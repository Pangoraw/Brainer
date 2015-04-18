"use strict";

/*
  Directives
 */
angular.module("myApp.directives", ["ngResource"]).directive("appVersion", [
  "version", function(version) {
    return function(scope, elm, attrs) {
      return elm.text(version);
    };
  }
]);
