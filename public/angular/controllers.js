"use strict";

/*
  Controllers
 */
var AppCtrl, CreateCtrl, EditCtrl, FileCtrl, FilesCtrl, UpdateCtrl;

AppCtrl = function($scope, $location) {
  $scope.name = "Pangoraw";
  return $scope.editFolder = function() {
    return $location.path("/editfolder");
  };
};

AppCtrl.$inject = ["$scope", "$location"];

FilesCtrl = function($scope, Socket, Files, $location) {
  $scope.files = [];
  $scope.q = '';
  Files.history.push("root");
  Files.setCurrentFolderId(Files.history[Files.history.length - 1]);
  Socket.emit('getFiles', Files.getCurrentFolderId());
  Socket.on('files', function(files) {
    if (files != null) {
      $scope.files = files;
      if (files.length > 0) {
        return Files.setCurrentFolderId(files[0].parent);
      }
    }
  });
  $scope.refresh = function() {
    return $scope.request(Files.getCurrentFolderId(), 'folder');
  };
  $scope.request = function(id, type) {
    if (type === "folder") {
      Socket.emit('getFiles', id);
      Files.setCurrentFolderId(id);
      Files.history.push(id);
      return Files.updateCurrentFolder();
    } else if (type === "text") {
      return $location.path("/file/" + id);
    }
  };
  $scope.goBackInHistory = function() {
    var id;
    if (Files.history.length > 2) {
      id = Files.history[Files.history.length - 2];
    } else {
      id = "root";
    }
    return $scope.request(id, 'folder');
  };
  $scope.goBackInTree = function() {
    return Socket.emit('getFilesInParent', Files.getCurrentFolderId());
  };
  $scope.goHome = function() {
    return $location.path('/home');
  };
  $scope.goCreate = function() {
    return $location.path('/create');
  };
  return $scope.updateCurrentFolder = function() {
    if (Files.getCurrentFolderId() === "root") {
      alert('You can not update the root folder.');
      return;
    }
    Files.updateCurrentFolder();
    return $location.path("/updateFolder/" + (Files.getCurrentFolderId()));
  };
};

FilesCtrl.$inject = ["$scope", "Socket", "Files", "$location"];

CreateCtrl = function($scope, Socket, Files, $location) {
  $scope.file = {
    type: "text",
    name: "",
    parent: ""
  };
  $scope.parentName = '';
  if (Files.getCurrentFolderId() !== "root") {
    Socket.emit('getFolder', Files.getCurrentFolderId());
    $scope.file.parent = Files.getCurrentFolderId();
  } else {
    $scope.file.parent = 'root';
    $scope.parentName = 'root';
  }
  Socket.on('folder', function(folder) {
    if (folder != null) {
      return $scope.parentName = folder.name;
    }
  });
  return $scope.create = function() {
    if ($scope.file.name !== "") {
      Socket.emit('newFile', $scope.file);
      return $location.path('/home');
    }
  };
};

CreateCtrl.$inject = ["$scope", "Socket", "Files", "$location"];

FileCtrl = function($scope, Socket, $routeParams, $location, $sce) {
  Socket.emit('getFile', $routeParams.id);
  Socket.on('file', function(file) {
    return $scope.file = file;
  });
  $scope.getContent = function(content) {
    return $sce.trustAsHtml(content);
  };
  $scope.edit = function() {
    if (($scope.file != null) && ($scope.file._id != null)) {
      return $location.path("/file/edit/" + $scope.file._id);
    }
  };
  return $scope["delete"] = function() {
    Socket.emit('deleteFile', $scope.file);
    return $location.path('/home');
  };
};

FileCtrl.$inject = ["$scope", "Socket", "$routeParams", "$location", "$sce"];

EditCtrl = function($scope, Socket, $routeParams, $location) {
  Socket.emit('getFile', $routeParams.id);
  Socket.on('file', function(file) {
    if (file.content == null) {
      file.content = '';
    }
    $scope.file = file;
    if ($scope.mirror == null) {
      $scope.mirror = CodeMirror(document.getElementById('code'), {
        theme: "neo",
        viewportMargin: 10,
        mode: "xml",
        htmlMode: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete"
        },
        value: $scope.file.content,
        lineNumbers: true,
        cursorScrollMargin: 10
      });
    }
    return $scope.mirror.on("changes", function() {
      $scope.changesCounter++;
      if ($scope.changesCounter > $scope.changesToSave) {
        $scope.changesCounter = 0;
        return $scope.save();
      }
    });
  });
  $scope.changesToSave = 25;
  $scope.changesCounter = 0;
  $scope.addSection = function() {
    return $scope.mirror.setValue($scope.mirror.getValue() + " \n<h2></h2>\n<p>\n\n</p>");
  };
  $scope.save = function() {
    $scope.file.content = $scope.mirror.getValue();
    return Socket.emit('updateFile', $scope.file);
  };
  return $scope.goBackToView = function() {
    return $location.path("/file/" + $scope.file._id);
  };
};

EditCtrl.$inject = ["$scope", "Socket", "$routeParams", "$location"];

UpdateCtrl = function($scope, Socket, $routeParams, $location) {
  Socket.emit('getFolder', $routeParams.id);
  Socket.on('folder', function(folder) {
    return $scope.folder = folder;
  });
  $scope.update = function() {
    Socket.emit('updateFile', $scope.folder);
    return $location.path("/home");
  };
  return $scope["delete"] = function() {
    return Socket.emit('deleteFile', $scope.folder);
  };
};

UpdateCtrl.$inject = ["$scope", "Socket", "$routeParams", "$location"];
