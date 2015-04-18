$('document').ready(function() {
  return $('.menu-icon').click(function(e) {
    var button;
    e.preventDefault();
    button = $(this);
    if (button.hasClass('is-open')) {
      $('.files-list').addClass('is-closed').removeClass('is-open');
      $('#info').addClass('is-closed').removeClass('is-open');
      $('.view').addClass('not-pushed').removeClass('pushed');
      return button.addClass('is-closed').removeClass('is-open');
    } else if (button.hasClass('is-closed')) {
      $('.files-list').addClass('is-open').removeClass('is-closed');
      $('#info').addClass('is-open').removeClass('is-closed');
      button.addClass('is-open').removeClass('is-closed');
      return $('.view').addClass('pushed').removeClass('not-pushed');
    }
  });
});
