$(document).ready(function () {
  $('.hdiw-control').on('click', function () {
    setHdiwStep(parseInt($(this).attr('data-index')))
  })

  function setHdiwStep (index) {
    const activeStep = $('.hdiw-content.active').attr('data-index')
    const nbItems = $('.hdiw-content').length
    if (index !== activeStep) {
      $('.hdiw-content.active').removeClass('active').addClass('hidden')
      $('.hdiw-content[data-index="'+index+'"]').removeClass('hidden').addClass('active')
      $('.hdiw-control.active').removeClass('active')
      $('.hdiw-control[data-index="'+index+'"]').addClass('active')

      if(index === 1) {
        $('.hdiw-arrow.prev').removeClass('enabled').addClass('disabled');
      } else {
        $('.hdiw-arrow.prev').removeClass('disabled').addClass('enabled');
      } 
      if (index === nbItems) {
        $('.hdiw-arrow.next').removeClass('enabled').addClass('disabled');
      } else {
        $('.hdiw-arrow.next').removeClass('disabled').addClass('enabled');
      }
    }
  }

  $('.hdiw-arrow.prev').on('click', function () {
    const currentIndex = parseInt($('.hdiw-content.active').attr('data-index'))
    if(currentIndex !== 1 && !$(this).hasClass('disabled')) {
      setHdiwStep(currentIndex - 1)
    }
  })
  $('.hdiw-arrow.next').on('click', function () {
    const currentIndex = $('.hdiw-content.active').attr('data-index')
    const nbItems = $('.hdiw-content').length
    const target = parseInt(currentIndex) + 1
    if(parseInt(currentIndex) < parseInt(nbItems) && !$(this).hasClass('disabled')) {
      setHdiwStep(target)
    }
  })

  // SLIDER 
  $('#use-cases-slider').slick({
    autoplay: false,
    dots: true
  })
  
  const url = document.location.href
  const urlSplit = url.split('/')
  let jsonPath = 'assets/json/data.json'
  if(urlSplit[urlSplit.length - 1] === 'fr' || urlSplit[urlSplit.length - 2] === 'fr') {
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