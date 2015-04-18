MongoDB = require '../database'
ObjectID = require('mongodb').ObjectID

exports.configure = (io) ->

	io.on 'connection', (socket) ->

		socket.on 'getFiles', (parentId) ->
			if !parentId? then parentId = "root"
			MongoDB.getFiles parentId, (files) ->
				socket.emit 'files', files

		socket.on 'getFile', (id) ->
			if id?
				MongoDB.getFile id, (file) ->
					socket.emit 'file', file

		socket.on 'getFolder', (id) ->
			if id?
				MongoDB.getFile id, (folder) ->
					socket.emit 'folder', folder

		socket.on 'newFile', (file) ->
			if file.type == 'text' then file.content = "<h1>#{file.name}</h1>"
			MongoDB.insertFile file
			MongoDB.getFiles file.parent, (files) ->
				socket.emit 'files', files

		socket.on 'updateFile', (file) ->
			MongoDB.updateFile file

		socket.on 'deleteFile', (file) ->
			MongoDB.deleteFile file._id, ->
				MongoDB.getFiles file.parent, (files) ->
					socket.emit 'files', files

		socket.on 'getFilesInParent', (id) ->
			MongoDB.getFile id, (file) ->
				if file?
					MongoDB.getFiles file.parent, (files) ->
						socket.emit 'files', files
