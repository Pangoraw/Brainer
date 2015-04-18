###
	Default route
###

exports.index = (req, res) ->
	res.render "index", { pretty : true }

exports.partials = (req, res) ->
	res.render "partials/" + req.params.name, { pretty : true }