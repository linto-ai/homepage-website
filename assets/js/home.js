$(document).ready(function () {

  window['page_lang'] = window.location.href.indexOf('/fr') >= 0 ? 'fr' : 'en'

  // Init Animation "how does it work?"
  const hdiwAnimationContainer = document.getElementById('hdiw-animation')
  let jsonAnimationPath01 = 'assets/json/animation-01.json'
  if (window['page_lang'] === 'fr') { 
    jsonAnimationPath01 = '../assets/json/animation-01.json'
  }
  let hdiwAnimation = lottie.loadAnimation({
    container: hdiwAnimationContainer, // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: jsonAnimationPath01, // the path to the animation json
    rendererSettings: {
      className: 'linto-animation-hdiw'
    }
  })
  // Animation Segments
  const segments = [
    [0, 50], // part 1
    [51, 100], // part 2 
    [101, 150], // part 3 
    [151, 200] // part 4
  ]

  hdiwAnimation.addEventListener('data_ready', function(){
    hdiwAnimation.playSegments(segments[0], true)
  })
  
  // how does it work : steps
  function setHdiwStep (index) {
    const activeStep = $('.hdiw-content.active').attr('data-index')
    const nbItems = $('.hdiw-content').length
    if (index !== activeStep) {
      $('.hdiw-content.active').removeClass('active').addClass('hidden')
      $('.hdiw-content[data-index="'+index+'"]').removeClass('hidden').addClass('active')
      $('.hdiw-control.active').removeClass('active')
      $('.hdiw-control[data-index="'+index+'"]').addClass('active')
      hdiwAnimation.playSegments(segments[index - 1], true)
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
    autoplay: true,
    autoplaySpeed: 5000,
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