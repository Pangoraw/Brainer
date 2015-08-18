EventEmitter = require('events')
FormCard 		 = require('./FormCard')
InfoCard 		 = require('./InfoCard')

module.exports = class FileList extends EventEmitter

	searchInput : null
	holder : null
	files : []
	selectedNodes : []

	constructor : ( holderId ) ->
		return if !holderId?

		document.querySelector "ul#file-list"

		@holder = document.querySelector "ul#file-list"

		@holder.addEventListener 'click', @_onClick

		@searchInput = document.querySelector "input.search"
		@searchInput.addEventListener "input", @_onSearchChange

	getFileFromName : ( name ) ->
		for file in @files
			if file.name == name then return file
		-1

	getFileFromId : ( id ) ->
		for file in @files
			if file._id == id then return file
		-1

	append : ( file ) ->
		return if !file?

		fileElt = document.createElement 'li'
		fileElt.classList.add 'animated'
		fileElt.classList.add 'fadeIn'
		fileElt.classList.add file.type
		fileElt.id = file._id

		pName = document.createElement 'p'
		pName.classList.add 'name'
		pName.innerHTML = file.name

		iType = document.createElement 'i'
		iType.classList.add 'material-icons'
		iType.classList.add 'type'
		if file.type != "text" then	iType.innerHTML = file.type
		else iType.innerHTML = "insert_drive_file"

		fileElt.appendChild pName
		fileElt.appendChild iType

		@holder.appendChild fileElt
		file.HTMLElt = fileElt
		@files.push file

	clean : -> @holder.innerHTML = ""

	edit : ->
		if @selectedNodes.length == 0 then new InfoCard "You can not edit. No file selected."; return
		file = @getFileFromId(@selectedNodes[0].id)
		if file.type == "folder" then new InfoCard "You can not edit a folder." ; return

		@emit 'edit', file._id

	delete : ->
		if @selectedNodes.length == 0 then new InfoCard "You can not delete. No file selected."; return
		@emit 'delete', @getFileFromId(@selectedNodes[0].id)

	update : ->
		if @selectedNodes.length == 0 then new InfoCard "You can not update. No file selected."; return
		oldName = @selectedNodes[0].children[0].innerHTML
		new FormCard [ { type : 'text', label : 'New name' } ], ( data ) =>
			newName = data[0]
			file = @getFileFromId(@selectedNodes[0].id)
			file.name = newName
			@emit 'update', file

	_onSearchChange : ( event ) =>
		query = @searchInput.value
		for file in @files
			if file.HTMLElt.innerHTML.search(new RegExp(query, "i")) < 0 then file.HTMLElt.style.display = "none"
			else file.HTMLElt.style.display = "list-item"

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
			@emit 'activated', @getFileFromId(@selectedNodes[0].id)
