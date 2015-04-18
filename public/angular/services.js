"use strict";

/*
  Services
 */
var socketServer;

socketServer = document.domain;

angular.module("myApp.services", []).value("version", "0.3.0").factory("Socket", [
  "$rootScope", function($rootScope) {
    var socket, socketService;
    socketService = {};
    socket = io.connect(socketServer);
    socketService.emit = function(event, data) {
      return socket.emit(event, data);
    };
    socketService.on = function(event, callback) {
      return socket.on(event, function(data) {
        return $rootScope.$apply(function() {
          return callback(data);
        });
      });
    };
    return socketService;
  }
]).factory("Files", [
  "Socket", function(Socket) {
    var filesServices;
    Socket.on('folder', function(folder) {
      return filesServices.currentFolder = folder;
    });
    filesServices = {};
    filesServices.history = [];
    filesServices.currentFolder = {};
    filesServices.currentFolderId = "root";
    filesServices.setCurrentFolderId = function(id) {
      return filesServices.currentFolderId = id;
    };
    filesServices.getCurrentFolderId = function() {
      return filesServices.currentFolderId;
    };
    filesServices.getCurrentFolder = function() {
      if (filesServices.currentFolder !== {}) {
        return filesServices.currentFolder;
      }
    };
    filesServices.updateCurrentFolder = function() {
      return Socket.emit('getFolder', filesServices.currentFolderId);
    };
    return filesServices;
  }
]);
