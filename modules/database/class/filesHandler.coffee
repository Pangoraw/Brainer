ObjectID = require('bson').ObjectID
Collection = require './collection'

module.exports = class FilesHandler extends Collection
	constructor : (dirName) ->
		super dirName, "files"

	findFiles : (parentId, callback) ->
		callback @get { q : { parent : parentId } }

	findFile : (id, callback) ->
		id = new ObjectID(id)
		callback( @get( { q : { _id : id } } ) ) 

	insertFile : (file) -> @add file
	insertFiles : (files) -> @add files

	# TODO : Allow updating, removing in class Collection

