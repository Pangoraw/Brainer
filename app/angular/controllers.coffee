"use strict"

###
  Controllers
###

AppCtrl = ($scope, $location) ->
  $scope.name = "Pangoraw"
  $scope.editFolder = ->
    $location.path "/editfolder"

AppCtrl.$inject = ["$scope", "$location"]

FilesCtrl = ($scope, Socket, Files, $location) ->
  $scope.files = []
  $scope.q = ''
  Files.history.push "root" 

  Files.setCurrentFolderId Files.history[Files.history.length-1]
  
  Socket.emit 'getFiles', Files.getCurrentFolderId() 
  Socket.on 'files', (files) ->
    if files?
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

FilesCtrl.$inject = ["$scope", "Socket", "Files", "$location"]

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

CreateCtrl.$inject = ["$scope", "Socket", "Files", "$location"]

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

FileCtrl.$inject = ["$scope", "Socket", "$routeParams", "$location", "$sce"]

EditCtrl = ($scope, Socket, $routeParams, $location) ->
  Socket.emit 'getFile', $routeParams.id
  
  Socket.on 'file', (file) ->
    if !file.content? then file.content = ''
    $scope.file = file
    if !$scope.mirror?
      $scope.mirror = CodeMirror document.getElementById('code'), { theme : "neo", viewportMargin : 10, mode : "xml", htmlMode : true, extraKeys: { "Ctrl-Space": "autocomplete" }, value : $scope.file.content, lineNumbers: true, cursorScrollMargin : 10 }
    $scope.mirror.on "changes", ->
      $scope.changesCounter++
      if $scope.changesCounter > $scope.changesToSave
        $scope.changesCounter = 0
        $scope.save()

  $scope.changesToSave = 25
  $scope.changesCounter = 0

  $scope.addSection = ->
    $scope.mirror.setValue($scope.mirror.getValue() + """ \n<h2></h2>
      <p>

      </p>""")

  $scope.save = ->
    $scope.file.content = $scope.mirror.getValue()
    Socket.emit 'updateFile', $scope.file

  $scope.goBackToView = ->
    $location.path "/file/#{$scope.file._id}"

EditCtrl.$inject = ["$scope", "Socket", "$routeParams", "$location"]

UpdateCtrl = ($scope, Socket, $routeParams, $location) ->
  Socket.emit 'getFolder', $routeParams.id
  Socket.on 'folder', (folder) -> $scope.folder = folder

  $scope.update = ->
    Socket.emit 'updateFile', $scope.folder
    $location.path "/home"

  $scope.delete = ->
    Socket.emit 'deleteFile', $scope.folder
    

UpdateCtrl.$inject = [ "$scope", "Socket", "$routeParams", "$location" ]