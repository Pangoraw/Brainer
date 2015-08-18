AppCtrl = ($scope, $location) ->
	document.querySelector("div.menu-icon").addEventListener "click", (event) ->
		event.preventDefault()
		button = document.querySelector("div.menu-icon")
		if button.classList.contains('is-open')
			document.querySelector('.files-list').classList.add('is-closed')
			document.querySelector('.files-list').classList.remove('is-open')
			document.querySelector('.view').classList.add('not-pushed')
			document.querySelector('.view').classList.remove('pushed')
			button.classList.add('is-closed')
			button.classList.remove('is-open')

		else if button.classList.contains('is-closed')
			document.querySelector('.files-list').classList.add('is-open')
			document.querySelector('.files-list').classList.remove('is-closed')
			document.querySelector('.view').classList.add('pushed')
			document.querySelector('.view').classList.remove('not-pushed')
			button.classList.add('is-open')
			button.classList.remove('is-closed')


module.exports = AppCtrl
