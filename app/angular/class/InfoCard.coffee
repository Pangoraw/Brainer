module.exports = class InfoCard

	overlay : undefined
	box : null
	
	constructor : (@content) ->
		return if document.getElementById('card').innerHTML == "" or @content == ""

		@overlay = document.getElementById('card-overlay')
		@overlay.classList.add 'shown'
		
		@box = document.getElementById('card')

		p = document.createElement('p')
		p.innerHTML = @content

		button = document.createElement('button')
		button.innerHTML = "Close"

		button.addEventListener 'click', @_onCloseButtonClick

		@box.appendChild(p)
		@box.appendChild(button)
		
	_onCloseButtonClick : (e) =>
		@box.innerHTML = ""
		@overlay.classList.remove 'shown'
		@overlay.classList.add 'hidden'