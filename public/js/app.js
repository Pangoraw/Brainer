(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/*
	Declare app level module which depends on filters, services, and directives
 */
var AppCtrl, CreateCtrl, EditCtrl, FileCtrl, FilesCtrl, UpdateCtrl, app;

app = angular.module("myApp", ["ngRoute", "ngSanitize"]);


/*
	Declare Services
 */

app.factory("Socket", ["$rootScope", require('./services/Socket')]);

app.factory("Files", ["Socket", require('./services/Files')]);


/*
	Declare Controllers
 */

AppCtrl = require('./controllers/AppCtrl');

FilesCtrl = require('./controllers/FilesCtrl');

CreateCtrl = require('./controllers/CreateCtrl');

FileCtrl = require('./controllers/FileCtrl');

EditCtrl = require('./controllers/EditCtrl');

UpdateCtrl = require('./controllers/UpdateCtrl');

app.controller("AppCtrl", ["$scope", "$location", AppCtrl]);

app.controller("FilesCtrl", ["$scope", "Socket", "Files", "$location", FilesCtrl]);

app.controller("CreateCtrl", ["$scope", "Socket", "Files", "$location", CreateCtrl]);

app.controller("FileCtrl", ["$scope", "Socket", "$routeParams", "$location", "$sce", FileCtrl]);

app.controller("EditCtrl", ["$scope", "Socket", "$routeParams", "$location", EditCtrl]);

app.controller("UpdateCtrl", ["$scope", "Socket", "$routeParams", "$location", UpdateCtrl]);


/*
	Declare routing
 */

app.config([
  "$routeProvider", function($routeProvider) {
    $routeProvider.when("/home", {
      templateUrl: "partials/home",
      controller: AppCtrl
    });
    $routeProvider.when("/create", {
      templateUrl: "partials/create",
      controller: CreateCtrl
    });
    $routeProvider.when("/file/:id", {
      templateUrl: "partials/file",
      controller: FileCtrl
    });
    $routeProvider.when("/file/edit/:id", {
      templateUrl: "partials/edit",
      controller: EditCtrl
    });
    $routeProvider.when("/updateFolder/:id", {
      templateUrl: "partials/updateFolder",
      controller: UpdateCtrl
    });
    return $routeProvider.otherwise({
      redirectTo: "/home"
    });
  }
]);



},{"./controllers/AppCtrl":5,"./controllers/CreateCtrl":6,"./controllers/EditCtrl":7,"./controllers/FileCtrl":8,"./controllers/FilesCtrl":9,"./controllers/UpdateCtrl":10,"./services/Files":11,"./services/Socket":12}],2:[function(require,module,exports){
var FileList;

module.exports = FileList = (function() {
  FileList.prototype.goTo = null;

  FileList.prototype.name = null;

  FileList.prototype.id = null;

  FileList.prototype.type = null;

  function FileList(name, id, type, goTo, parentId) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.goTo = goTo;
  }

  return FileList;

})();



},{}],3:[function(require,module,exports){
var FormCard,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = FormCard = (function() {
  FormCard.prototype.overlay = null;

  FormCard.prototype.box = null;

  FormCard.prototype.inputs = [];

  FormCard.prototype.callback = null;

  function FormCard(data, callback) {
    var button, closeButton, i, inp, j, label, len, len1, node, option, optionElt, ref, ref1, selectElt;
    if (callback == null) {
      callback = function() {};
    }
    this._onSubmit = bind(this._onSubmit, this);
    this._onClose = bind(this._onClose, this);
    if (document.getElementById('card').innerHTML !== "") {
      return;
    }
    if (!Array.isArray(data)) {
      return;
    }
    this.callback = callback;
    this.overlay = document.querySelector('div#card-overlay');
    this.overlay.classList.remove('hidden');
    this.overlay.classList.add('shown');
    this.box = document.getElementById('card');
    for (i = 0, len = data.length; i < len; i++) {
      inp = data[i];
      if (inp.type === "list") {
        if (inp.label !== void 0) {
          label = document.createElement('label');
          label.innerHTML = inp.label;
          this.box.appendChild(label);
        }
        selectElt = document.createElement('select');
        ref = inp.options;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          option = ref[j];
          optionElt = document.createElement('option');
          optionElt.textContent = option;
          optionElt.value = option;
          selectElt.appendChild(optionElt);
        }
        this.box.appendChild(selectElt);
        this.inputs.push(selectElt);
      } else {
        if (inp.label != null) {
          label = document.createElement('label');
          label.innerHTML = inp.label;
          this.box.appendChild(label);
        }
        node = document.createElement('input');
        node.type = inp.type;
        if (inp.placeholder != null) {
          if ((ref1 = inp.value) != null ? ref1 : node.placeholder = inp.placeholder) {
            node.value = inp.value;
          }
        }
        this.box.appendChild(node);
        this.inputs.push(node);
      }
    }
    button = document.createElement('button');
    button.innerHTML = "Submit";
    closeButton = document.createElement('button');
    closeButton.innerHTML = "x";
    closeButton.classList.add('close-button');
    this.box.appendChild(closeButton);
    this.box.appendChild(button);
    closeButton.addEventListener('click', this._onClose);
    button.addEventListener('click', this._onSubmit);
  }

  FormCard.prototype._onClose = function(e) {
    e.preventDefault();
    this.box.innerHTML = "";
    this.overlay.classList.remove('shown');
    return this.overlay.classList.add('hidden');
  };

  FormCard.prototype._onSubmit = function(e) {
    var i, input, j, len, len1, out, ref, ref1;
    e.preventDefault();
    out = [];
    ref = this.inputs;
    for (i = 0, len = ref.length; i < len; i++) {
      input = ref[i];
      out.push(input.value);
    }
    ref1 = this.inputs;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      input = ref1[j];
      this.inputs.splice(this.inputs.indexOf(input, 1));
    }
    this.box.innerHTML = "";
    this.overlay.classList.remove('shown');
    this.overlay.classList.add('hidden');
    return this.callback(out);
  };

  return FormCard;

})();



},{}],4:[function(require,module,exports){
var InfoCard,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = InfoCard = (function() {
  InfoCard.prototype.overlay = void 0;

  InfoCard.prototype.box = null;

  function InfoCard(content) {
    var button, p;
    this.content = content;
    this._onCloseButtonClick = bind(this._onCloseButtonClick, this);
    if (document.getElementById('card').innerHTML === "" || this.content === "") {
      return;
    }
    this.overlay = document.getElementById('card-overlay');
    this.overlay.classList.add('shown');
    this.box = document.getElementById('card');
    p = document.createElement('p');
    p.innerHTML = this.content;
    button = document.createElement('button');
    button.innerHTML = "Close";
    button.addEventListener('click', this._onCloseButtonClick);
    this.box.appendChild(p);
    this.box.appendChild(button);
  }

  InfoCard.prototype._onCloseButtonClick = function(e) {
    this.box.innerHTML = "";
    this.overlay.classList.remove('shown');
    return this.overlay.classList.add('hidden');
  };

  return InfoCard;

})();



},{}],5:[function(require,module,exports){
var AppCtrl;

AppCtrl = function($scope, $location) {
  $scope.name = "Pangoraw";
  return $scope.editFolder = function() {
    return $location.path("/editfolder");
  };
};

module.exports = AppCtrl;



},{}],6:[function(require,module,exports){
var CreateCtrl;

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

module.exports = CreateCtrl;



},{}],7:[function(require,module,exports){
var EditCtrl;

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

module.exports = EditCtrl;



},{}],8:[function(require,module,exports){
var FileCtrl;

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

module.exports = FileCtrl;



},{}],9:[function(require,module,exports){
var FileList, FilesCtrl, FormCard, InfoCard;

InfoCard = require('../class/InfoCard');

FormCard = require('../class/FormCard');

FileList = require('../class/FileList');

FilesCtrl = function($scope, Socket, Files, $location) {
  var _onCreate;
  $scope.files = [];
  $scope.q = '';
  Files.history.push("root");
  Files.setCurrentFolderId(Files.history[Files.history.length - 1]);
  Socket.emit('getFiles', Files.getCurrentFolderId());
  Socket.on('files', function(files) {
    if (files != null) {
      if (!Array.isArray(files)) {
        files = [files];
      }
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
    return new FormCard([
      {
        type: "text",
        label: "Name"
      }, {
        label: "Type",
        options: ["text", "folder"],
        type: "list"
      }
    ], _onCreate);
  };
  _onCreate = (function(_this) {
    return function(data) {
      var file;
      file = {
        type: data[1],
        name: data[0],
        parent: Files.getCurrentFolderId()
      };
      if (file.name === "" || file.type === "") {
        new InfoCard("Can not create file. Name not specified.");
        return;
      }
      Socket.emit("newFile", file);
      return $location.path("/home");
    };
  })(this);
  return $scope.updateCurrentFolder = function() {
    if (Files.getCurrentFolderId() === "root") {
      alert('You can not update the root folder.');
      return;
    }
    Files.updateCurrentFolder();
    return $location.path("/updateFolder/" + (Files.getCurrentFolderId()));
  };
};

module.exports = FilesCtrl;



},{"../class/FileList":2,"../class/FormCard":3,"../class/InfoCard":4}],10:[function(require,module,exports){
var UpdateCtrl;

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

module.exports = UpdateCtrl;



},{}],11:[function(require,module,exports){
var Files;

Files = function(Socket) {
  var filesServices;
  Socket.on('folder', function(folder) {
    return filesServices.currentFolder = folder;
  });
  filesServices = {};
  filesServices.history = [];
  filesServices.currentFolder = {};
  filesServices.currentFolderId = "root";
  filesServices.setCurrentFolderId = function(id) {
    return filesServices.currentFolderId = id;
  };
  filesServices.getCurrentFolderId = function() {
    return filesServices.currentFolderId;
  };
  filesServices.getCurrentFolder = function() {
    if (filesServices.currentFolder !== {}) {
      return filesServices.currentFolder;
    }
  };
  filesServices.updateCurrentFolder = function() {
    return Socket.emit('getFolder', filesServices.currentFolderId);
  };
  return filesServices;
};

module.exports = Files;



},{}],12:[function(require,module,exports){
var Socket, socketServer;

socketServer = document.domain;

Socket = function($rootScope) {
  var socket, socketService;
  socketService = {};
  socket = io.connect(socketServer);
  socketService.emit = function(event, data) {
    return socket.emit(event, data);
  };
  socketService.on = function(event, callback) {
    return socket.on(event, function(data) {
      return $rootScope.$apply(function() {
        return callback(data);
      });
    });
  };
  return socketService;
};

module.exports = Socket;



},{}]},{},[1])