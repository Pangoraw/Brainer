"use strict";

/*
  Declare app level module which depends on filters, services, and directives
 */
angular.module("myApp", ["ngRoute", "ngSanitize", "myApp.filters", "myApp.services", "myApp.directives"]).config([
  "$routeProvider", function($routeProvider) {
    $routeProvider.when("/test", {
      templateUrl: "partials/test",
      controller: AppCtrl
    });
    $routeProvider.when("/home", {
      templateUrl: "partials/home",
      controller: AppCtrl
    });
    $routeProvider.when("/create", {
      templateUrl: "partials/create",
      controller: CreateCtrl
    });
    $routeProvider.when("/file/:id", {
      templateUrl: "partials/file",
      controller: FileCtrl
    });
    $routeProvider.when("/file/edit/:id", {
      templateUrl: "partials/edit",
      controller: EditCtrl
    });
    $routeProvider.when("/updateFolder/:id", {
      templateUrl: "partials/updateFolder",
      controller: UpdateCtrl
    });
    return $routeProvider.otherwise({
      redirectTo: "/home"
    });
  }
]);
