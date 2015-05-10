module.exports = class FormCard 
	
	overlay : null
	box : null
	inputs : []

	constructor : ( data, callback ) ->
		return if not Array.isArray data or not data ? or not callback ? or data.length == 0

		@overlay = document.getElementById('card-overlay')
		@overlay.classList.add 'shown'

		@box = document.getElementById('card')

		for inp in data
			node = document.createElement('input')
			node.type = inp.type
			node.placeholder = inp.placeholder
			node.value = inp.value

			if inp.label ?
				label = document.createElement('label')
				label.innerHTML = inp.label
				@box.appendChild(label)

			@box.appendChild(node)
			
			@inputs.push node

		button = document.createElement('button')
		button.innerHTML = "Submit"
		
		button.addEventListener 'click', @_onSubmit

	_onSubmit : (e) ->
		e.preventDefault()

		out = []

		out.push input.value for input in @inputs

		@box.innerHTML = ""
		@overlay.classList.remove 'shown'
		@overlay.classList.add 'hidden'

		out