let homepageLinks = document.getElementsByClassName('homepage-link')

// Homepage links click events
for(let link of homepageLinks) {
  link.addEventListener('click', (e) => {
    if(!link.classList.contains('active')) {
      resetHomepageLinks()
      link.classList.add('active')
    }
    else link.classList.remove('active')
  })
}

function resetHomepageLinks(){
  let homepageLinks = document.getElementsByClassName('homepage-link')
  for(let link of homepageLinks) {
    if(link.classList.contains('active')) link.classList.remove('active')
  }
}