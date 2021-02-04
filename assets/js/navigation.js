$(document).ready(function() {
    // get nav links
    const navLinks = $('.header--nav-link')

    // get parents nav links
    const navLinksParents = $('.header--nav-link__parent')

    // get children blocks
    const navChildrens = $('.header--nav-children')

    // parents nav link on : mouseover
    navLinksParents.on('mouseover', function(e) {
        const jThis = $(this)
        if (!jThis.hasClass('active')) {
            navChildrens.addClass('hidden')
            navLinksParents.removeClass('active')

            const linkId = jThis.attr('id')
            const targetSub = $('div[data-parent="' + linkId + '"]')
            if (targetSub.hasClass('hidden')) {
                targetSub.removeClass('hidden')
                jThis.addClass('active')
            }

            targetSub.on('mouseleave', function() {
                jThis.removeClass('active')
                targetSub.addClass('hidden')
            })
        }
    })

    navLinks.on('mouseover', function(e) {
        if (!$(this).hasClass('header--nav-link__parent')) {
            navLinksParents.removeClass('active')
            navChildrens.addClass('hidden')
        }
    })

    // burger nav btn
    $('#header--burger-btn').on('click', function() {
        const header = $('#header-mobile')
        if (header.hasClass('closed')) {
            header.removeClass('closed').addClass('opened')
            setTimeout(() => {
                $('#mobile-nav').removeClass('hidden');
            }, 300);

        } else if (header.hasClass('opened')) {
            $('#mobile-nav').addClass('hidden');

            setTimeout(() => {
                header.removeClass('opened').addClass('closed')
            }, 100);
        }
    })
})