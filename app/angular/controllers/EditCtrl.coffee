EditCtrl = ($scope, Socket, $routeParams, $location) ->
	Socket.emit 'getFile', $routeParams.id

	Socket.on 'file', (file) ->
		if !file.content? then file.content = ''
		$scope.file = file
		options = { theme : "elegant", viewportMargin : 10, mode : "gfm", extraKeys: { "Ctrl-Space": "autocomplete" }, value : $scope.file.content, lineNumbers: true, cursorScrollMargin : 10 }
		if file.type == "slideshow" then options.mode = "javascript"
		if !$scope.mirror?
			$scope.mirror = CodeMirror document.getElementById('code'), options
		$scope.mirror.on "changes", ->
			$scope.changesCounter++
			if $scope.changesCounter > $scope.changesToSave
				$scope.changesCounter = 0
				$scope.save()

	$scope.changesToSave = 25
	$scope.changesCounter = 0

	$scope.save = ->
		$scope.file.content = $scope.mirror.getValue()
		Socket.emit 'updateFile', $scope.file

	$scope.goBackToView = ->
		$location.path "/file/#{$scope.file._id}"

module.exports = EditCtrl
