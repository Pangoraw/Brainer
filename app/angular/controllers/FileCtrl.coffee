FileCtrl = ($scope, Socket, $routeParams, $location, $sce) ->
	Socket.emit 'getFile', $routeParams.id
	Socket.on 'file', (file) ->
		$scope.file = file

	$scope.getContent = (content) -> $sce.trustAsHtml content
 
	$scope.edit = ->
		if $scope.file? && $scope.file._id?
			$location.path "/file/edit/#{$scope.file._id}"

	$scope.delete = ->
		Socket.emit 'deleteFile', $scope.file
		$location.path '/home'

module.exports = FileCtrl