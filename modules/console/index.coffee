require "colors"

Console =
  getTime : () ->
    date = new Date()

    hours = date.getHours()
    minutes = date.getMinutes()
    seconds = date.getSeconds()

    hours = "0" + hours if hours < 10
    minutes = "0" + minutes if minutes < 10
    seconds = "0" + seconds if seconds < 10

    return "#{hours}:#{minutes}:#{seconds}"
  log : (msg) ->
  	timestamp = @getTime()
  	console.log "["+"INFO".blue+"] " + "#{timestamp} -".grey + " #{msg}".white
  error : (msg) ->
  	timestamp = @getTime()
  	console.log "["+"ERROR".red+"]" + " #{timestamp} - ".grey.italic + "#{msg}".white

module.exports = Console
