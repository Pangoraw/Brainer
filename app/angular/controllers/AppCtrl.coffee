AppCtrl = ($scope, $location) ->
	$scope.name = "Pangoraw"
	$scope.editFolder = ->
		$location.path "/editfolder"

module.exports = AppCtrl