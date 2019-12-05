$(document).ready(function () {
  let basePath = ''
  if (window.location.host === 'linto-ai.github.io') {
    basePath = 'https://linto-ai.github.io/homepage-website'
  } else if (window.location === 'linto-ai.local') {
    basePath = 'http://linto-ai.local'
  }

  // Toggle page language menu
  $('#lang-btn, #lang-btn-burger').on('click', function () {
    if ($('.lang-list').hasClass('hidden')) {
      $('.lang-list').removeClass('hidden').addClass('visible')
      $(this).removeClass('closed').addClass('opened')
    } else {
      $('.lang-list').removeClass('visible').addClass('hidden')
      $(this).removeClass('opened').addClass('closed')
    }
  })

  // Page language update
  $('.lang-update').on('click', function () {
    const target = $(this).attr('data-href')
    setTimeout(function () {
      document.location.href = basePath + target
    }, 300)
  })

  // BURGER NAV
  $('#burger-menu').on('click', function () {
    if ($(this).hasClass('closed')) {
      $(this).removeClass('closed').addClass('opened')
      $('#burger-menu-nav').removeClass('hidden')
      $('header').css('height', '100%')
    } else {
      $(this).removeClass('opened').addClass('closed')
      $('#burger-menu-nav').addClass('hidden')
      $('header').css('height', '40px')
    }
  })

  // Anchor links
  $('.nav-link').on('click', function () {
    if ($(this).attr('href').indexOf('#') >= 0) {
      const burgerMenuDisplay = $('#burger-nav').css('display')
      if (burgerMenuDisplay === 'flex') {
        $('#burger-menu').removeClass('opened').addClass('closed')
        $('#burger-menu-nav').addClass('hidden')
        $('header').css('height', '40px')
      }
    }
  })
})
