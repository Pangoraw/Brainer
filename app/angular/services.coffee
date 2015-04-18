"use strict"

###
  Services
###

socketServer = document.domain

angular.module("myApp.services", [])
.value("version", "0.3.0")
.factory("Socket",
  ["$rootScope",
    ($rootScope) ->

      socketService = {}

      socket = io.connect(socketServer)

      socketService.emit = (event, data) ->
        socket.emit event, data

      socketService.on = (event, callback) ->
        socket.on event, (data) ->
          $rootScope.$apply ->
            callback data

      socketService
  ]
)
.factory("Files",
  [ "Socket",
  (Socket) ->

    Socket.on 'folder', (folder) -> filesServices.currentFolder = folder 

    filesServices = {}
    
    filesServices.history = []
    filesServices.currentFolder = {}

    filesServices.currentFolderId = "root"
    
    filesServices.setCurrentFolderId  = (id) -> filesServices.currentFolderId = id
    filesServices.getCurrentFolderId  = -> filesServices.currentFolderId
    filesServices.getCurrentFolder    = -> if filesServices.currentFolder != {} then filesServices.currentFolder 
    filesServices.updateCurrentFolder = -> Socket.emit 'getFolder', filesServices.currentFolderId
    
    filesServices

  ]
)