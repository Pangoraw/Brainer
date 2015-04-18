"use strict";

/*
  Filters
 */
angular.module("myApp.filters", []).filter("title", function() {
  return function(user) {
    return user.id + " - " + user.name;
  };
});
