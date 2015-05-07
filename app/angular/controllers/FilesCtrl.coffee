FilesCtrl = ($scope, Socket, Files, $location) ->
	$scope.files = []
	$scope.q = ''
	Files.history.push "root" 

	Files.setCurrentFolderId Files.history[Files.history.length-1]
	
	Socket.emit 'getFiles', Files.getCurrentFolderId()

	Socket.on 'files', (files) ->
		if files?
			if ! Array.isArray files then files = [ files ]
			$scope.files = files
			if files.length > 0
				Files.setCurrentFolderId files[0].parent

	$scope.refresh = ->
		$scope.request Files.getCurrentFolderId(), 'folder'

	$scope.request = (id, type) ->
		if type == "folder" 
			Socket.emit 'getFiles', id
			Files.setCurrentFolderId id
			Files.history.push id
			Files.updateCurrentFolder()
		else if type == "text"
			$location.path "/file/#{id}"

	$scope.goBackInHistory = ->
		if Files.history.length > 2 then id = Files.history[Files.history.length - 2]
		else id = "root"
		$scope.request id, 'folder'

	$scope.goBackInTree = ->
		Socket.emit 'getFilesInParent', Files.getCurrentFolderId()
	
	$scope.goHome = ->
		$location.path '/home'

	$scope.goCreate = ->
		$location.path '/create'


	$scope.updateCurrentFolder = ->
		if Files.getCurrentFolderId() == "root" then alert 'You can not update the root folder.'; return 
		Files.updateCurrentFolder() 
		$location.path "/updateFolder/#{Files.getCurrentFolderId()}"

module.exports = FilesCtrl