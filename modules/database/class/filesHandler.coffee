ObjectID = require('bson').ObjectID
Collection = require './collection'

module.exports = class FilesHandler extends Collection
	constructor : (dirName) ->
		super dirName, "files"
		@removeFile("554b8cbb1431d4241a32df5x", ->)

	findFiles : (parentId, callback) ->
		callback @get { q : { parent : parentId } }

	findFile : (id, callback) ->
		callback( @get( { q : { _id : id } } ) ) 

	insertFile : (file, callback=->) -> @add file; callback()
	insertFiles : (files, callback=->) -> @add files; callback()

	removeFile : (id, callback=->) -> if @remove id then callback()

	updateFile : (file, callback=->) -> @update file; callback()

	# TODO : Allow updating in class Collection

