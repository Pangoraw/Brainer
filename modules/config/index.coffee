###
	Server configuration
###

# Communication
cson = require 'cson'

userConfig = cson.parseFile "./config.cson"
defaultConfig =
	server :
		host : "localhost"
		port : 8080
	database :
		host : "localhost"
		port : 27017

exports.IPADDR = defaultConfig.server.host
exports.PORT = defaultConfig.server.port

exports.DATABASEIP = defaultConfig.database.host
exports.DATABASEPORT = defaultConfig.database.port

if userConfig.server?
	exports.IPADDR = userConfig.server.host if userConfig.server.host?
	exports.PORT = userConfig.server.port if userConfig.server.port?

if userConfig.database?
	exports.DATABASEIP = userConfig.database.host if userConfig.database.host?
	exports.DATABASEPORT = userConfig.database.port if userConfig.database.port?

# Internal Functionment
exports.VIEW_ENGINE = 'jade'
