$(document).ready(function () { 

  // BURGER NAV
  $('#burger-menu').on('click', function () {
    if($(this).hasClass('closed')){
      $(this).removeClass('closed').addClass('opened')
      $('#burger-menu-nav').removeClass('hidden')
      $('header').css('height','100%')
    } else {
      $(this).removeClass('opened').addClass('closed')
      $('#burger-menu-nav').addClass('hidden')
      $('header').css('height','40px')
    }
  })

  // Anchor links
  $('.nav-link').on('click', function () {
    if ($(this).attr('href').indexOf('#') >= 0) {
      const burgerMenuDisplay = $('#burger-nav').css('display')
      if(burgerMenuDisplay === 'flex') {
        $('#burger-menu').removeClass('opened').addClass('closed')
        $('#burger-menu-nav').addClass('hidden')
        $('header').css('height','40px')
      }
    }
  })
})