$(document).ready(function () {

  // Init How does it work animation
  const hdiwAnimationContainer = document.getElementById('hdiw-animation')
  let jsonPath = 'assets/json/animation-0' + index + '.json'
  if (window.location.href.indexOf('/fr') >= 0) {
    jsonPath = '../assets/json/animation-0' + index + '.json'
  }
  let hdiwAnimation = lottie.loadAnimation({
    container: hdiwAnimationContainer, // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: jsonPath, // the path to the animation json
    rendererSettings: {
      className: 'linto-animation-hdiw'
    }
  })

  // how does it work : step
  function setHdiwStep (index) {
    const activeStep = $('.hdiw-content.active').attr('data-index')
    const nbItems = $('.hdiw-content').length
    if (index !== activeStep) {
      $('.hdiw-content.active').removeClass('active').addClass('hidden')
      $('.hdiw-content[data-index="'+index+'"]').removeClass('hidden').addClass('active')
      $('.hdiw-control.active').removeClass('active')
      $('.hdiw-control[data-index="'+index+'"]').addClass('active')
      let animPath = 'assets/json/animation-0' + index + '.json'
      if (window.location.href.indexOf('/fr') >= 0) {
        animPath = '../assets/json/animation-0' + index + '.json'
      }
      hdiwAnimation.destroy()
      setTimeout(function () {
        hdiwAnimation = lottie.loadAnimation({
          container: hdiwAnimationContainer, // the dom element that will contain the animation
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: animPath, // the path to the animation json
          rendererSettings: {
            className: 'linto-animation-hdiw'
          }
        })
      }, 150)
      
      if(index === 1) {
        $('.hdiw-arrow.prev').removeClass('enabled').addClass('disabled')
      } else {
        $('.hdiw-arrow.prev').removeClass('disabled').addClass('enabled')
      } 
      if (index === nbItems) {
        $('.hdiw-arrow.next').removeClass('enabled').addClass('disabled')
      } else {
        $('.hdiw-arrow.next').removeClass('disabled').addClass('enabled')
      }
    }
  }

  // On click : HDIW step number
  $('.hdiw-control').on('click', function () {
    setHdiwStep(parseInt($(this).attr('data-index')))
  })

  // On click : HDIW prev arrow
  $('.hdiw-arrow.prev').on('click', function () {
    const currentIndex = parseInt($('.hdiw-content.active').attr('data-index'))
    if(currentIndex !== 1 && !$(this).hasClass('disabled')) {
      setHdiwStep(currentIndex - 1)
    }
  })

  // On click : HDIW next arrow
  $('.hdiw-arrow.next').on('click', function () {
    const currentIndex = $('.hdiw-content.active').attr('data-index')
    const nbItems = $('.hdiw-content').length
    const target = parseInt(currentIndex) + 1
    if(parseInt(currentIndex) < parseInt(nbItems) && !$(this).hasClass('disabled')) {
      setHdiwStep(target)
    }
  })

  // Init use-cases SLIDER 
  $('#use-cases-slider').slick({
    autoplay: false,
    dots: true
  })
  
  // Animation LinTO Blink
  let jsonPath = 'assets/json/data.json'
  if (window.location.href.indexOf('/fr') >= 0) {
    jsonPath = '../assets/json/data.json'
  }
  const animationContainer = document.getElementById('linto-animated')
  lottie.loadAnimation({
    container: animationContainer, // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: jsonPath, // the path to the animation json
    rendererSettings: {
      className: 'linto-animation-home'
    }
  })
})