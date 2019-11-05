$(document).ready(function () {
  const browserLang = window.navigator.userLanguage || window.navigator.language
  const cookieLang = getCookie('userLang')
  const url = document.location.href
  let urlSplit = url.split('/')
  let currentPageLang = 'fr'
  let basePath = ''

  if (urlSplit[urlSplit.length - 2 ] === 'en') {
    currentPageLang = 'en'
    for(let i = 0; i < urlSplit.length - 2; i++) {
      basePath += urlSplit[i] + '/'
    }
  } else {
    for(let i = 0; i < urlSplit.length - 1; i++) {
      basePath += urlSplit[i] + '/'
    }
  }
  if (cookieLang === 'undefined' || cookieLang.length === 0) { // No cookie
    if (browserLang !== 'fr-FR' && currentPageLang !== 'en') {
      document.location.href = basePath + 'en/' 
    }
  } else { // userLang Cookie
    if(cookieLang === 'en' && currentPageLang === 'fr') {
      document.location.href = basePath + 'en'
    } 
    else if (cookieLang === 'fr' && currentPageLang === 'en') {
      document.location.href = basePath
    }
  }
  $('#lang-btn').on('click', function () {
    if ($('.lang-list').hasClass('hidden')) {
      $('.lang-list').removeClass('hidden').addClass('visible')
      $(this).removeClass('closed').addClass('opened')
    } else {
      $('.lang-list').removeClass('visible').addClass('hidden')
      $(this).removeClass('opened').addClass('closed')
    }
  })


  $('.lang-update').on('click', function() {
    const target = $(this).attr('data-href')
    const lang = $(this).attr('data-lang')

    setCookie('userLang', lang, 31);

    setTimeout(function () {
      document.location.href = target
    }, 300)
  })

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

  function setCookie (cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    var expires = "expires="+ d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
  }

  function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }
})