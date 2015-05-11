EventEmitter = require('events')
FormCard = require('./FormCard')

module.exports = class FileList extends EventEmitter

	holder : null
	files : []
	selectedNodes : []

	constructor : ( holderId ) ->
		return if not holderId ?

		document.querySelector "ul#file-list"

		@holder = document.querySelector "ul#file-list"

		@holder.addEventListener 'click', @_onClick

	getFileFromName : ( name ) ->
		for file in @files
			if file.name == name then return file
		-1

	append : ( file ) ->
		fileElt = document.createElement 'li'
		fileElt.classList.add 'animated'
		fileElt.classList.add 'slideInLeft'
		fileElt.classList.add file.type

		pName = document.createElement 'p'
		pName.classList.add 'name'
		pName.innerHTML = file.name

		pType = document.createElement 'p'
		pType.classList.add 'type'
		pType.innerHTML = file.type

		fileElt.appendChild pName
		fileElt.appendChild pType

		@holder.appendChild fileElt
		@files.push file

	clean : -> @holder.innerHTML = ""

	delete : -> @emit 'delete', @getFileFromName(@selectedNodes[0].children[0].innerHTML)
	update : -> 
		oldName = @selectedNodes[0].children[0].innerHTML
		new FormCard [ { type : 'text', label : 'New name' } ], ( data ) =>
			newName = data[0]
			file = @getFileFromName(@selectedNodes[0].children[0].innerHTML)
			file.name = newName
			@emit 'update', file

	_onClick : ( event ) =>
		event.preventDefault()

		if event.target.innerHTML.slice(0, 1) != "<"
			target = event.target.parentElement
		else target = event.target
		
		if target == @holder
			node.classList.remove "selected" for node in @selectedNodes
			@selectedNodes.splice node, 1 for node in @selectedNodes
		else if @selectedNodes.indexOf(target) == -1
			node.classList.remove "selected" for node in @selectedNodes
			@selectedNodes.splice node, 1 for node in @selectedNodes
			@selectedNodes.push target
			target.classList.add "selected"
		else
			@emit 'activated', @getFileFromName(target.children[0].innerHTML)