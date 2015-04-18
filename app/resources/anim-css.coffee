$('document').ready ->
	$('.menu-icon').click (e) ->
		e.preventDefault()
		button = $(this)
		if button.hasClass('is-open')
			$('.files-list').addClass('is-closed').removeClass('is-open')
			$('#info').addClass('is-closed').removeClass('is-open')
			$('.view').addClass('not-pushed').removeClass('pushed')
			button.addClass('is-closed').removeClass('is-open')

		else if button.hasClass('is-closed')
			$('.files-list').addClass('is-open').removeClass('is-closed')
			$('#info').addClass('is-open').removeClass('is-closed')
			button.addClass('is-open').removeClass('is-closed')
			$('.view').addClass('pushed').removeClass('not-pushed')