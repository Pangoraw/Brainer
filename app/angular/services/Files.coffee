Files = (Socket) ->
	Socket.on 'folder', (folder) -> filesServices.currentFolder = folder 

	filesServices = {}

	filesServices.history = []
	filesServices.currentFolder = {}

	filesServices.currentFolderId = "root"

	filesServices.setCurrentFolderId  = (id) -> filesServices.currentFolderId = id
	filesServices.getCurrentFolderId  = -> filesServices.currentFolderId
	filesServices.getCurrentFolder    = -> if filesServices.currentFolder != {} then filesServices.currentFolder 
	filesServices.updateCurrentFolder = -> Socket.emit 'getFolder', filesServices.currentFolderId

	filesServices

module.exports = Files