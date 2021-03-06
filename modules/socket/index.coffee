db = require '../database'

exports.configure = (io) ->

	FilesDatabase = new db.FilesHandler "data"

	io.on 'connection', (socket) ->

		socket.on 'getFiles', (parentId) ->
			if !parentId? then parentId = "root"
			FilesDatabase.findFiles parentId, (files) ->
				socket.emit 'files', files

		socket.on 'getFile', (id) ->
			if id?
				FilesDatabase.findFile id, (file) ->
					socket.emit 'file', file

		socket.on 'getFolder', (id) ->
			if id?
				FilesDatabase.findFile id, (folder) ->
					socket.emit 'folder', folder

		socket.on 'newFile', (file) ->
			if file.type == 'text' then file.content = "<h1>#{file.name}</h1>"
			else if file.type == 'slideshow' then file.content = "[ { \"content\" : \"Here is your first slide.\", \"title\" : \"#{file.name}\" } ]"
			FilesDatabase.insertFile file, ->
				FilesDatabase.findFiles file.parent, (files) ->
					socket.emit 'files', files

		socket.on 'getFilesInParent', (id) ->
			FilesDatabase.findFile id, (file) ->
				if file?
					FilesDatabase.findFiles file.parent, (files) ->
						socket.emit 'files', files

		socket.on 'deleteFile', (id) ->
			FilesDatabase.removeFile id, ->

		socket.on 'updateFile', (file) ->
			FilesDatabase.updateFile file
