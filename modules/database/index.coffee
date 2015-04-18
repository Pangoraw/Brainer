MongoClient = require('mongodb').MongoClient
ObjectID 	= require('mongodb').ObjectID
assert 		= require 'assert'

config 		= require '../config'

url = "mongodb://#{config.DATABASEIP}:#{config.DATABASEPORT}/brainer"

findFiles = (db, parentId, callback) ->
	collection = db.collection 'files'
	collection.find({ parent : parentId }).toArray (err, files) ->
		if err then throw err
		callback files
		db.close()

findFile = (db, id, callback) ->
	if id == "root" 
		ID = id
	else ID = new ObjectID(id)
	collection = db.collection 'files'
	collection.findOne { _id : ID }, (err, file) ->
		if err then throw err
		else callback file
		db.close()

insertDocument = (db, file) -> 
	collection = db.collection 'files'
	collection.insert [ file ], 
	(err) ->
		assert.equal err, null

updateDocument = (db, file) ->
	file._id = new ObjectID(file._id)
	collection = db.collection 'files'
	collection.update { _id : file._id }, { $set: file }, (err) -> 
		if err then throw err
		db.close()

removeDocument = (db, id, callback) ->
	_id = new ObjectID(id)
	collection = db.collection 'files'
	collection.remove { _id : _id }, { writeConcern: { w: "majority", wtimeout: 5000 } }, (err) ->
		if err then throw err
		callback()
		db.close()

exports.updateFile = (file) ->
	MongoClient.connect url, (err, db) ->
		if err then throw err
		else updateDocument db, file

exports.getFiles = (parentId, emit) ->
	MongoClient.connect url, (err, db) ->
		if err then throw err
		else findFiles db, parentId, emit

exports.getFile = (id, emit) ->
	MongoClient.connect url, (err, db) ->
		if err then throw err
		else findFile db, id, emit

exports.insertFile = (file) ->
	MongoClient.connect url, (err, db) ->
		if err then throw err
		else insertDocument db, file

exports.deleteFile = (id, callback) ->
	MongoClient.connect url, (err, db) ->
		if err then console.log err
		else removeDocument db, id, callback
