ObjectID = require('bson').ObjectID
Collection = require './collection'

module.exports = class FilesHandler extends Collection
	constructor : (dirName) ->
		super dirName, "files"

	findFiles : (parentId, callback) ->
		callback @get { q : { parent : parentId } }

	findFile : (id, callback) ->
		if id == "root" 
			ID = id
		else ID = new ObjectID(id)
		callback( @get( { q : { _id : ID } } ) ) 

	insertFile : (file) -> @add file
	insertFiles : (files) -> @add files

	# TODO : Allow updating, removing in class Collection

