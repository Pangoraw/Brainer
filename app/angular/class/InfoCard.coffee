module.exports = class InfoCard

	overlay : undefined
	box : null
	
	constructor : ( @content ) ->
		return if !@content?

		@overlay = document.getElementById('card-overlay')
		@overlay.classList.add 'shown'
		@overlay.classList.remove 'hidden'
		
		@box = document.getElementById('card')
		@box.innerHTML = ""

		p = document.createElement('p')
		p.innerHTML = @content

		button = document.createElement('button')
		button.innerHTML = "Close"

		button.addEventListener 'click', @_onCloseButtonClick
		@overlay.addEventListener 'click', @_onCloseButtonClick

		@box.appendChild(p)
		@box.appendChild(button)
		
	_onCloseButtonClick : (e) =>
		@box.innerHTML = ""
		@overlay.classList.remove 'shown'
		@overlay.classList.add 'hidden'