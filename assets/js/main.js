$(document).ready(function () {
  window['animated'] = false
  const header = document.getElementById('header')
  const headerHeight = header.offsetHeight
  const hdiw = document.getElementById('hdiw')
  const winHeight = window.innerHeight
  
  const homeTop = document.getElementById('home-top')
  const contentHeight = (winHeight - headerHeight) + 'px'
  

  // Resize Homepage elements
  hdiw.setAttribute('style', 'height:' + contentHeight)
  homeTop.setAttribute('style', 'height:' + contentHeight)

  $(document).on('resize', function () {
    // Resize Homepage elements
    hdiw.setAttribute('style', 'height:' + (winHeight - headerHeight)  +'px')
    homeTop.setAttribute('style', 'height:' + (winHeight - headerHeight)  +'px')
  })

  /*==== SCROLL MAGIC ====*/
  /* "How does it work ?" */
  var controller = new ScrollMagic.Controller();
  var scene = new ScrollMagic.Scene({
      triggerElement: "#hdiw",
      triggerHook: "onLeave",
      duration: '300%',
      offset: -headerHeight
    })
    .setPin("#hdiw")
    .addTo(controller);

    scene.on("progress", function (event) {
      const currentSelected = $('.working-process-item.selected')
      const currentIndex = currentSelected.attr('data-index')

      if(window['animated'] === false) {
        if(parseFloat(event.progress) < 0.25 && currentIndex !== "1") {
          setAnimationIndex(currentIndex, 1, scene)
        }
        else if(parseFloat(event.progress) >= 0.25 && event.progress < 0.5 && currentIndex !== "2") {
          setAnimationIndex(currentIndex, 2, scene)
        }
        else if(parseFloat(event.progress) >= 0.5 && event.progress < 0.75 &&
        currentIndex !== "3") {
          setAnimationIndex(currentIndex, 3 ,scene)
        }
        else if(parseFloat(event.progress) >= 0.75 && event.progress <= 1 && currentIndex !== "4") {
          setAnimationIndex(currentIndex, 4, scene)
        }
      }
  })

  function setAnimationIndex (currentIndex, targetIndex, scene) {
    const currentItem = $('.working-process-item[data-index="'+ currentIndex +'"]')
    const currentBarIndex = $('.working-state-index[data-index="'+ currentIndex +'"]')
    const targetItem =  $('.working-process-item[data-index="'+ targetIndex +'"]')
    const targetBarIndex = $('.working-state-index[data-index="'+ targetIndex +'"]')

    currentItem.removeClass('selected')
    targetItem.addClass('selected')
    window['animated'] = true
    window['anim_target'] = targetIndex
    currentItem.velocity({
      opacity: 0,
      display: 'none'
    }, {
      duration: 200,
      complete: () => {
        currentItem.removeClass('selected')
        currentBarIndex.removeClass('selected')
        targetItem.velocity({
          display: 'flex',
          opacity: 1
        },{
          duration: 200,
          complete: () => {
            targetItem.addClass('selected')
            targetBarIndex.addClass('selected')
            window['animated'] = false
            if(scene.state() === "DURING"){
              const progress =  0.25 * parseInt(window['anim_target']) - 0.24
              scene.progress( progress)
            }
          }
        })
      }
    })
  }
  /*==== END SCROLL MAGIC ====*/
  /*==== USE CASES SLIDER ====*/
  $('#usecases-slider').slick({
    autoplay: true,
    autoplaySpeed: 6000,
    dots: true
  })

  /*==== END USE CASES SLIDER ====*/

})