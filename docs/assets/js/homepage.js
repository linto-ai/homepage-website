let homepageLinks = document.getElementsByClassName('homepage-link')

// Homepage links click events
for(let link of homepageLinks) {
  link.addEventListener('click', (e) => {
    if(!link.classList.contains('active')) {
      resetHomepageLinks()
      link.classList.add('active')
      let target = link.getAttribute('data-anim')
      setAnimation(target)
    }
    else {
      link.classList.remove('active')
      resetAnimClasses()
      setAnimation('default')
    }
  })
}

function resetHomepageLinks(){
  let homepageLinks = document.getElementsByClassName('homepage-link')
  for(let link of homepageLinks) {
    if(link.classList.contains('active')) link.classList.remove('active')
  }
}

function setAnimation(target) {
  resetAnimClasses()
  let animContainer = document.getElementById('homepage-animation-mask')
  animContainer.innerHTML = ''

  switch(target) {
    case "coginitve-apis":
      animContainer.innerHTML = `<lottie-player src="/assets/json/linto-animation.json" background="transparent" width="400px" height="400px" speed="1.5"  loop autoplay></lottie-player>`
      break
    case "linto-agent":
      animContainer.classList.add('linto-agent')
      break
    case "smart-meeting":
      animContainer.classList.add('smart-meeting')
      animContainer.classList.add('bordered')
    case "default":
      animContainer.classList.add('default')
      break
  }
  animContainer.classList.remove('fading-out')
  animContainer.classList.add('fading-in')
  setTimeout(()=>{
    animContainer.classList.remove('fading-in')
  }, 700)
  

}


function resetAnimClasses() {
  let animContainer = document.getElementById('homepage-animation-mask')
  animContainer.classList.remove('default')
  animContainer.classList.remove('bordered')
  animContainer.classList.remove('linto-agent')
  animContainer.classList.remove('smart-meeting')
  animContainer.classList.remove('fading-in')
  animContainer.classList.add('fading-out')
}