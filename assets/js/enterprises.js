
window.onload = function (e) {
  //setSectionTopHeight()
  setContentSection()
  $(document).on('resize', function() {
    //setSectionTopHeight()
    setContentSection()
  })

  function setContentSection () {
    window['winWidth'] = $(window).width()
    const overflow = 300
    const calcWidth = parseInt(window['winWidth'] - overflow );
    $('.content-section.enterprise').each(function () {
      $(this).attr('style', 'width:' +calcWidth + 'px;')
    })
  }
  function setSectionTopHeight () {
    window['winHeight'] = $(window).height()
    const sectionTop = $('#enterprises-solutions-top')
    sectionTop.attr('style', 'height:' + window['winHeight']+ 'px;')
  }
  
  const controller = new ScrollMagic.Controller();
  const contentScene = new ScrollMagic.Scene({
    triggerElement: "#section-content-wrapper",
    triggerHook: 0,
    offset: '-80'
  })
  .addTo(controller)
  .on("enter", function (e) {
    $('#content-nav').removeClass('hidden').addClass('visible')
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

