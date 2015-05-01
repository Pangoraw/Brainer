UpdateCtrl = ($scope, Socket, $routeParams, $location) ->
	Socket.emit 'getFolder', $routeParams.id
	Socket.on 'folder', (folder) -> $scope.folder = folder

	$scope.update = ->
		Socket.emit 'updateFile', $scope.folder
		$location.path "/home"

	$scope.delete = ->
		Socket.emit 'deleteFile', $scope.folder

module.exports = UpdateCtrl