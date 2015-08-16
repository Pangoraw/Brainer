csl = require "./modules/console"
express = require "express"
routes = require "./modules/routes"
path = require 'path'
config = require './modules/config'
app = express()

app.set "views", __dirname + "/views"
app.set "view engine", config.VIEW_ENGINE
app.set 'ipaddr', config.IPADDR
app.set 'port', config.PORT
app.use express.static __dirname + '/public'

if app.get 'env' == 'development' then app.use express.errorHandler()

app.get "/", routes.index
app.get "/partials/:name", routes.partials
app.get "*", routes.index

serverStarted = ->
	csl.log "Express server listening on http://#{app.get 'ipaddr'}:#{app.get 'port'}"

server = app.listen app.get('port'), app.get('ipaddr'), serverStarted

io = require('socket.io').listen server
require('./modules/socket').configure io
