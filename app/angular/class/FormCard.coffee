module.exports = class FormCard

	overlay : null
	box : null
	inputs : []
	callback : null

	constructor : ( data, callback=-> ) ->
		if document.getElementById('card').innerHTML != "" then return
		if not Array.isArray(data) and typeof data is "object" then data = [data]
		else if not Array.isArray data then return


		@callback = callback

		@overlay = document.querySelector('div#card-overlay')
		@overlay.classList.remove 'hidden'
		@overlay.classList.add 'shown'

		@box = document.getElementById('card')

		for inp in data
			if inp.type == "list"
				if inp.label != undefined
					label = document.createElement('label')
					label.innerHTML = inp.label
					@box.appendChild label

				selectElt = document.createElement('select')

				for option in inp.options
					optionElt = document.createElement('option')
					optionElt.textContent = option.name
					optionElt.value = option.value
					selectElt.appendChild optionElt
				@box.appendChild selectElt
				@inputs.push selectElt

			else
				if inp.label?
					label = document.createElement('label')
					label.innerHTML = inp.label
					@box.appendChild label
				node = document.createElement('input')
				node.type = inp.type
				node.value = inp.value if inp.value?
				node.placeholder = inp.placeholder if inp.placeholder?
				@box.appendChild node
				@inputs.push node

		button = document.createElement('button')
		button.innerHTML = "Submit"

		closeButton = document.createElement('button')
		closeButton.innerHTML = "Cancel"
		closeButton.classList.add 'close-button'

		@box.appendChild(button)
		@box.appendChild(closeButton)

		closeButton.addEventListener 'click', @_onClose
		button.addEventListener 'click', @_onSubmit

	_onClose : (e) =>
		e.preventDefault()

		@box.innerHTML = ""
		@overlay.classList.remove 'shown'
		@overlay.classList.add 'hidden'

	_onSubmit : (e) =>
		e.preventDefault()

		out = []

		for input in @inputs
			out.push input.value
		for input in @inputs
			@inputs.splice @inputs.indexOf input, 1

		@box.innerHTML = ""
		@overlay.classList.remove 'shown'
		@overlay.classList.add 'hidden'

		@callback out
