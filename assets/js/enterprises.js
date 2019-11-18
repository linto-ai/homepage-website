
window.onload = function (e) {
  window['page_lang'] = window.location.href.indexOf('/fr') >= 0 ? 'fr' : 'en'

  // Init Animation "how does it work?"
  const animationContainer = document.getElementById('linto-animation')
  let jsonAnimationPath = 'assets/json/animation.json'
  if (window['page_lang'] === 'fr') { 
    jsonAnimationPath = '../assets/json/animation.json'
  }
  let hdiwAnimation = lottie.loadAnimation({
    container: animationContainer, // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: jsonAnimationPath, // the path to the animation json
    rendererSettings: {
      className: 'linto-animation-hdiw'
    }
  })
  hdiwAnimation.setSpeed(0.8)


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

