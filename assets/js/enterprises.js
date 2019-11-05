
window.onload = function (e) {
  
  setContentSection()
  $(window).on('resize', function() {
    setContentSection()
    
  })

  function setContentSection () {
    const burgerMenuDisplay = $('#burger-nav').css('display')
    if(burgerMenuDisplay === 'none') {
      window['winWidth'] = $(window).width()
      const overflow = 300
      const calcWidth = parseInt(window['winWidth'] - overflow );
      $('.content-section.enterprise').each(function () {
        $(this).attr('style', 'width:' +calcWidth + 'px;')
      })
    } else {
      $('#content-nav').removeClass('visible').addClass('hidden');
      $('.content-section.enterprise').attr('style', '')

    }
  }
  const controller = new ScrollMagic.Controller();
  const contentScene = new ScrollMagic.Scene({
    triggerElement: "#section-content-wrapper",
    triggerHook: 0,
    offset: '-80'
  })
  .addTo(controller)
  .on("enter", function (e) {
    const burgerMenuDisplay = $('#burger-nav').css('display')
    if(burgerMenuDisplay === 'none') {
      $('#content-nav').removeClass('hidden').addClass('visible')
    }
    else{
      $('#content-nav').removeClass('visible').addClass('hidden')
    }
  })
  .on("leave", function (e) {
    $('#content-nav').removeClass('visible').addClass('hidden')
  })

  $('.title-anchor, .section-anchor').each(function () {
    const elem = '#' + $(this).attr('id')
    new ScrollMagic.Scene({
      triggerElement: elem,
      triggerHook: 0,
      offset: '-60'
    })
    .addTo(controller)
    .on("enter", function (e) {
      $('.content-nav-link.active').removeClass('active')
      const navLink = $('.content-nav-link[href="'+elem+'"]')
      navLink.addClass('active')
    }).on("leave", function (e) {
      $('.content-nav-link.active').removeClass('active')
      const navLink = $('.content-nav-link[href="'+elem+'"]')
      navLink.addClass('active')
    })
  })
}

