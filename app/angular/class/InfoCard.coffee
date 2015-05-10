module.exports = class InfoCard

	overlay : undefined
	
	constructor : (@content, callback=@_onCloseButtonClick) ->
		width = window.innerWidth
		height = window.innerHeight

		@overlay = document.getElementById('card-overlay')
		@overlay.classList.add 'shown'
		
		box = document.getElementById('card')

		p = document.createElement('p')
		p.innerHTML = @content

		button = document.createElement('button')
		button.innerHTML = "Close"

		button.addEventListener 'click', @_onCloseButtonClick

		box.appendChild(p)
		box.appendChild(button)
		
	_onCloseButtonClick : (e) =>
		@overlay.style.display = "none"