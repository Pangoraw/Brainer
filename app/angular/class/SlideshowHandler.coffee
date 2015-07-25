InfoCard = require('./InfoCard')

module.exports = class SlideshowHandler

	index : 0

	constructor : ( @data ) ->
		new InfoCard "Slideshow is empty" if @data.length == 0

		document.getElementById('text-content').style.display = "none"

		@holder = document.getElementById('slideshow-content').children[0]
		@infoPanel = document.getElementById('slideshow-content').children[1]
		
		s = @data[@index]

		if s.title?
			sElt = document.createElement 'h1'
			sElt.textContent = s.title
			@holder.appendChild sElt
		if s.content?
			cElt = document.createElement 'p'	
			cElt.textContent = s.content
			@holder.appendChild cElt

		@setInfo("#{ @index + 1 }/#{ @data.length }")

		document.getElementById('slideshow-content').addEventListener 'contextmenu', @_onRightClick
		document.getElementById('slideshow-content').addEventListener 'click', @_onClick

	_onClick : =>
		@index++
		if @index > @data.length - 1 then new InfoCard "No more slides." ; return

		s = @data[@index]

		@holder.innerHTML = ""

		if s.title?
			sElt = document.createElement 'h1'
			sElt.textContent = s.title
			@holder.appendChild sElt
		if s.content?
			cElt = document.createElement 'p'
			cElt.textContent = s.content
			@holder.appendChild cElt
		@setInfo("#{ @index + 1 }/#{ @data.length }")

	_onRightClick : (e) =>
		e.preventDefault()
		return if @index == 0
		@index = @index - 2
		@_onClick()


	setInfo : (str) -> @infoPanel.innerHTML = str