"use strict"

###
	Declare app level module which depends on filters, services, and directives
###

app = angular.module("myApp", [ "ngRoute", "ngSanitize" ])


###
	Declare Services
###

app.factory("Socket", ["$rootScope", require('./services/Socket')])
app.factory("Files", ["Socket", require('./services/Files')])

###
	Declare Controllers
###

AppCtrl 	 = require('./controllers/AppCtrl')
FilesCtrl  = require('./controllers/FilesCtrl')
FileCtrl   = require('./controllers/FileCtrl')
EditCtrl   = require('./controllers/EditCtrl')

app.controller "AppCtrl", [ "$scope", "$location", AppCtrl ]
app.controller "FilesCtrl", [ "$scope", "Socket", "Files", "$location", FilesCtrl ]
app.controller "FileCtrl", [ "$scope", "Socket", "$routeParams", "$location", "$sce", FileCtrl ]
app.controller "EditCtrl", [ "$scope", "Socket", "$routeParams", "$location", EditCtrl ]

###
	Declare routing
###

app.config [
	"$routeProvider", 
	($routeProvider) ->
		$routeProvider.when "/home", { templateUrl: "partials/home", controller: AppCtrl }
		$routeProvider.when "/file/:id", { templateUrl: "partials/file", controller: FileCtrl }
		$routeProvider.when "/file/edit/:id", { templateUrl: "partials/edit", controller: EditCtrl }
		$routeProvider.otherwise { redirectTo: "/home" }
	]
