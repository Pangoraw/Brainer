InfoCard = require('../class/InfoCard')
FormCard = require('../class/FormCard')
FileList = require('../class/FileList')

FilesCtrl = ($scope, Socket, Files, $location) ->
	$scope.files = []
	$scope.q = ''
	Files.history.push "root" 

	FileList = new FileList "file-list"
	
	FileList.on 'edit', (id) => $location.path "file/edit/#{id}"
	FileList.on 'update', ( file ) => Socket.emit 'updateFile', file
	FileList.on 'delete', ( file ) => 
		Socket.emit 'deleteFile', file
		Socket.emit 'getFiles', Files.getCurrentFolderId()
	FileList.on 'activated', ( file ) =>
		if file.type == "text" or file.type == "slideshow"
			$location.path("/file/#{file._id}").replace()
			$scope.$apply()
		else if file.type == "folder"
			FileList.clean()
			Socket.emit 'getFiles', file._id
			Files.setCurrentFolderId file._id
			Files.history.push file._id
			Files.updateCurrentFolder()
		

	Files.setCurrentFolderId Files.history[Files.history.length-1]

	Socket.emit 'getFiles', Files.getCurrentFolderId()

	Socket.on 'files', (files) ->
		if files?
			FileList.clean()
			if ! Array.isArray files then files = [ files ]
			$scope.files = files
			if files.length > 0
				Files.setCurrentFolderId files[0].parent
			FileList.append { _id : file._id, name : file.name, type : file.type } for file in $scope.files


	$scope.refresh = ->
		FileList.clean()
		Socket.emit 'getFiles', Files.getCurrentFolderId()

	$scope.goBackInHistory = ->
		if Files.history.length > 2 then id = Files.history[Files.history.length - 2]
		else id = "root"
	
	$scope.goBackInTree = ->
		FileList.clean() if Files.getCurrentFolderId() != "root"
		Socket.emit 'getFilesInParent', Files.getCurrentFolderId()
	
	$scope.goHome = -> $location.path '/home'

	$scope.goCreate = -> new FormCard [ { type : "text", label : "Name" }, { label : "Type", options : [ { value : "text", name : "Text" }, { value : "folder", name : "Folder" }, { value : "slideshow", name : "Slideshow" } ], type : "list" } ], _onCreate

	_onCreate = ( data ) =>
		file = { type : data[1], name : data[0], parent : Files.getCurrentFolderId() }
		if file.name == "" or file.type == "" then new InfoCard "Can not create file. Name not specified."; return 
		Socket.emit "newFile", file
		$location.path "/home"

	$scope.editFile 	= -> FileList.edit()
	$scope.changeName = -> FileList.update()
	$scope.deleteFile = -> FileList.delete()

module.exports = FilesCtrl