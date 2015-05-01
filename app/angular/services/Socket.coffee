socketServer = document.domain

Socket = ($rootScope) ->
  socketService = {}

  socket = io.connect(socketServer)

  socketService.emit = (event, data) ->
    socket.emit event, data

  socketService.on = (event, callback) ->
    socket.on event, (data) ->
      $rootScope.$apply ->
        callback data

  socketService

module.exports = Socket