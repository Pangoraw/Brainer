fs = require 'fs'
ObjectId = require('bson').ObjectId

module.exports = class Collection

	url : ""
	collectionName : ""

	constructor : (dirName, n) ->
		if !dirName? or !n? then console.log "Database : Bad Argument"; return
		@url = "./#{dirName}/#{n}.json"

		@collectionName = n

		fs.exists "./#{dirName}", (e) -> 
			if not e then fs.mkdir './data', -> console.log "Folder #{dirName} created."
		fs.exists @url, (e) -> if !e then fs.writeFileSync("./#{dirName}/#{n}.json", "[]")

	add : (obj) ->
		return if not obj?

		data = JSON.parse(fs.readFileSync(@url))
		return if not Array.isArray data

		if Array.isArray obj
			for o in obj
				if !o._id? then o._id = new ObjectId()
				data.push o 
		else 
			if !obj._id? then obj._id = new ObjectId()
			data.push obj

		data = JSON.stringify data, null, 2

		fs.writeFileSync @url, data

	get : (options) ->
		data = JSON.parse(fs.readFileSync @url)
		if not Array.isArray data then console.log "not array"
		if not options? then console.log "not options"

		out = []

		if options.q?
			for q of options.q
				for obj in data
					for p of obj
						if p == q and obj[p] == options.q[q] then out.push obj


		if options.count? and typeof options.count == 'number' and options.count >= 0
			temp = out
			out = []
			for i in [0...options.count]
				out[i] = temp[i]
			console.log "Error in count operation" if out.length != options.count

		out = out[0] if out.length == 1

		return out

	remove : (id) ->
		data = JSON.parse(fs.readFileSync @url)

		for i in [0..data.length-1]
			obj = data[i]
			continue if !obj?
			if obj._id == id
				data.splice i, 1
				data = JSON.stringify(data, null, 2)
				fs.writeFileSync @url, data
				return true
		false

	update : (obj) ->
		data = JSON.parse(fs.readFileSync @url)

		for i in [0...data.length-1]
			temp = data[i]
			if temp._id == obj._id
				data[i] = obj

		data = JSON.stringify data, null, 2
		fs.writeFileSync @url, data

	removeCollection : ->
		fs.unlink @url, (e) -> if e? then console.log e else console.log "Database : Removed file #{ @collectionName }.json"

	getName : -> @collectionName
				