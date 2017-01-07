###
	Server configuration
###

# Communication
cson = require 'cson'
fs = require 'fs'

defaultConfig =
	server :
		host : "localhost"
		port : 8080
	database :
		host : "localhost"
		port : 27017

if fs.existsSync "./config.cson"
	userConfig = cson.parseFile "./config.cson"
	
	if userConfig.server?
		exports.IPADDR = userConfig.server.host or defaultConfig.server.host
		exports.PORT = userConfig.server.port or defaultConfig.server.port

else
	exports.IPADDR = defaultConfig.server.host
	exports.PORT = defaultConfig.server.port

# Internal Functionment
exports.VIEW_ENGINE = 'jade'
