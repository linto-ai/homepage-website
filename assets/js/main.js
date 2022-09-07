window.addEventListener('load', () => {
  /* HEADER NAVIGATION */
  let navParent = document.getElementsByClassName('nav-item-parent')
  for(let parent of navParent) {
    parent.addEventListener('mouseover', (e) =>  {showSubNav(e)})
  }
    
  function showSubNav(e) {
    closeAllSubNav()
    let parent = e.target
    let targetId = parent.getAttribute('data-target')
    let subNav = document.getElementById(targetId)
    subNav.classList.remove('hidden')
    subNav.classList.add('visible')
    parent.classList.add('active')

    parent.addEventListener('mouseleave', (e) => {
      checkNavMouseOut(e, targetId)
    })
    subNav.addEventListener('mouseleave', (e) => {
      checkNavMouseOut(e, targetId)
    })
  }

  function checkNavMouseOut(e, targetId) {
    let targetMouse = e.toElement
      // close nav dropdown if mouseout is not on the nav dropdown or label
      if(
        (targetMouse.getAttribute('data-target') !== null && targetMouse.getAttribute('data-target') !== targetId)  || 
        (targetMouse.getAttribute('id') !== null && targetMouse.getAttribute('id') !== targetId) ||
        (targetMouse.getAttribute('id') === null && targetMouse.getAttribute('data-target') === null)
        ) {
        closeSubNav(targetId)
      }
  }
  function closeSubNav(target){
    let navParent = document.getElementsByClassName('nav-item-parent')
    for(let parent of navParent) {
      parent.classList.remove('active')
    }

    let subNav = document.getElementsByClassName('nav-item-dropdown')
    for(let nav of subNav) {
      if(nav.getAttribute('id') == target) {
        nav.classList.remove('visible')
        nav.classList.add('hidden')
      }
    }
  }

  function closeAllSubNav(){
    let subNav = document.getElementsByClassName('nav-item-dropdown')
    for(let nav of subNav) {
      nav.classList.remove('visible')
      nav.classList.add('hidden')
    }
  }
})


