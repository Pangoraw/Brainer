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
var EventEmitter, FileList, FormCard,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EventEmitter = require('events');

FormCard = require('./FormCard');

module.exports = FileList = (function(superClass) {
  extend(FileList, superClass);

  FileList.prototype.holder = null;

  FileList.prototype.files = [];

  FileList.prototype.selectedNodes = [];

  function FileList(holderId) {
    this._onClick = bind(this._onClick, this);
    var ref;
    if ((ref = !holderId) != null ? ref : document.querySelector("ul#file-list")) {
      return;
    }
    this.holder = document.querySelector("ul#file-list");
    this.holder.addEventListener('click', this._onClick);
  }

  FileList.prototype.getFileFromName = function(name) {
    var file, i, len, ref;
    ref = this.files;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      if (file.name === name) {
        return file;
      }
    }
    return -1;
  };

  FileList.prototype.append = function(file) {
    var fileElt, pName, pType;
    fileElt = document.createElement('li');
    fileElt.classList.add('animated');
    fileElt.classList.add('slideInLeft');
    fileElt.classList.add(file.type);
    pName = document.createElement('p');
    pName.classList.add('name');
    pName.innerHTML = file.name;
    pType = document.createElement('p');
    pType.classList.add('type');
    pType.innerHTML = file.type;
    fileElt.appendChild(pName);
    fileElt.appendChild(pType);
    this.holder.appendChild(fileElt);
    return this.files.push(file);
  };

  FileList.prototype.clean = function() {
    return this.holder.innerHTML = "";
  };

  FileList.prototype["delete"] = function() {
    return this.emit('delete', this.getFileFromName(this.selectedNodes[0].children[0].innerHTML));
  };

  FileList.prototype.update = function() {
    var oldName;
    oldName = this.selectedNodes[0].children[0].innerHTML;
    return new FormCard([
      {
        type: 'text',
        label: 'New name'
      }
    ], (function(_this) {
      return function(data) {
        var file, newName;
        newName = data[0];
        file = _this.getFileFromName(_this.selectedNodes[0].children[0].innerHTML);
        file.name = newName;
        return _this.emit('update', file);
      };
    })(this));
  };

  FileList.prototype._onClick = function(event) {
    var i, j, k, l, len, len1, len2, len3, node, ref, ref1, ref2, ref3, results, target;
    event.preventDefault();
    if (event.target.innerHTML.slice(0, 1) !== "<") {
      target = event.target.parentElement;
    } else {
      target = event.target;
    }
    if (target === this.holder) {
      ref = this.selectedNodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        node.classList.remove("selected");
      }
      ref1 = this.selectedNodes;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        node = ref1[j];
        results.push(this.selectedNodes.splice(node, 1));
      }
      return results;
    } else if (this.selectedNodes.indexOf(target) === -1) {
      ref2 = this.selectedNodes;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        node = ref2[k];
        node.classList.remove("selected");
      }
      ref3 = this.selectedNodes;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        node = ref3[l];
        this.selectedNodes.splice(node, 1);
      }
      this.selectedNodes.push(target);
      return target.classList.add("selected");
    } else {
      return this.emit('activated', this.getFileFromName(target.children[0].innerHTML));
    }
  };

  return FileList;

})(EventEmitter);



},{"./FormCard":3,"events":13}],3:[function(require,module,exports){
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
          optionElt.textContent = option.name;
          optionElt.value = option.value;
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
  FileList = new FileList("file-list");
  FileList.on('update', (function(_this) {
    return function(file) {
      return Socket.emit('updateFile', file);
    };
  })(this));
  FileList.on('delete', (function(_this) {
    return function(file) {
      Socket.emit('deleteFile', file);
      return Socket.emit('getFiles', Files.getCurrentFolderId());
    };
  })(this));
  FileList.on('activated', (function(_this) {
    return function(file) {
      if (file.type === "text") {
        $location.path("/file/" + file._id).replace();
        return $scope.$apply();
      } else if (file.type === "folder") {
        FileList.clean();
        Socket.emit('getFiles', file._id);
        Files.setCurrentFolderId(file._id);
        Files.history.push(file._id);
        return Files.updateCurrentFolder();
      }
    };
  })(this));
  Files.setCurrentFolderId(Files.history[Files.history.length - 1]);
  Socket.emit('getFiles', Files.getCurrentFolderId());
  Socket.on('files', function(files) {
    var file, i, len, ref, results;
    if (files != null) {
      FileList.clean();
      if (!Array.isArray(files)) {
        files = [files];
      }
      $scope.files = files;
      if (files.length > 0) {
        Files.setCurrentFolderId(files[0].parent);
      }
      ref = $scope.files;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        results.push(FileList.append({
          _id: file._id,
          name: file.name,
          type: file.type
        }));
      }
      return results;
    }
  });
  $scope.refresh = function() {
    FileList.clean();
    return Socket.emit('getFiles', Files.getCurrentFolderId());
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
    if (Files.getCurrentFolderId() !== "root") {
      FileList.clean();
    }
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
        options: [
          {
            value: "text",
            name: "Text"
          }, {
            value: "folder",
            name: "Folder"
          }
        ],
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
  $scope.changeName = function() {
    return FileList.update();
  };
  return $scope.deleteFile = function() {
    return FileList["delete"]();
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



},{}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1])