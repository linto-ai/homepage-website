
window.onload = (event) => {
  document.getElementById("cookie-banner-ok-btn").addEventListener("click", acceptCookies)
  try {
    const hasAcceptedCookie = localStorage.getItem("ok-cookie");
    if(hasAcceptedCookie === "yes") {
        acceptCookies()
    }
  } catch (error) {
    
  }
};

function acceptCookies() {
    const cookieBanner = document.getElementById("cookie-banner");
    cookieBanner.style.display = "none";
    // put it to localStorage
    localStorage.setItem("ok-cookie", "yes");
    
}


