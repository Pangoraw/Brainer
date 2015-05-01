CreateCtrl = ($scope, Socket, Files, $location) ->
	$scope.file = {
		type : "text",
		name : "",
		parent : ""
	}
	$scope.parentName = ''

	if Files.getCurrentFolderId() != "root" 
		Socket.emit 'getFolder', Files.getCurrentFolderId()
		$scope.file.parent = Files.getCurrentFolderId()
	else 
		$scope.file.parent = 'root'
		$scope.parentName = 'root'

	Socket.on 'folder', (folder) ->
		if folder?
			$scope.parentName = folder.name

	$scope.create = ->
		if $scope.file.name != ""
			Socket.emit 'newFile', $scope.file
			$location.path '/home'

module.exports = CreateCtrl