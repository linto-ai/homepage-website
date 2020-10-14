/* light box */
$('.lightbox__img').on('click', function(e)  {
    const src = $(this).attr('src')
    let directionClass = ''
    if (!!e.target) {
        const offsetWidth = e.target.offsetWidth
        const offsetHeight = e.target.offsetHeight

        if (offsetWidth - offsetHeight < 0) {
            //portrait
            directionClass = 'portrait'
        } else {
            //paysage
            directionClass = 'landscape'
        }
    }
    const lightbox = `
            <div class="lightbox--wrapper" id="lightbox">
              <div class="lightbox--container">
                <button class="lightbox__btn--close"></button>
                <img src="${src}" class="lightbox__img--zoomed ${directionClass}"/>
              </div>
            </div>
            `
        // Open lightbox
    $('body').append(lightbox)

    // Close lightbox
    $('.lightbox__btn--close').on('click', function(e)  {

        $('#lightbox').remove()
    })
})