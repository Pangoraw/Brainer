Slideshow = require('../class/SlideshowHandler')
showdown = require 'showdown'

FileCtrl = ($scope, Socket, $routeParams, $location, $sce) ->
	converter = new showdown.Converter()
	$scope.file = {}
	Socket.emit 'getFile', $routeParams.id
	Socket.on 'file', (file) ->
		if file.type == "text"
			#document.getElementById('slideshow-content').style.display = "none"
			$scope.file = file
		else if file.type == "slideshow"
			slideShow = new Slideshow JSON.parse(file.content)
			$scope.file.name = file.name
			$scope._id = file._id

	$scope.getContent = (content) -> $sce.trustAsHtml(converter.makeHtml(content))

	$scope.edit = ->
		if $scope.file? && $scope.file._id?
			$location.path "/file/edit/#{$scope.file._id}"

	$scope.delete = ->
		Socket.emit 'deleteFile', $scope.file
		$location.path '/home'

module.exports = FileCtrl
