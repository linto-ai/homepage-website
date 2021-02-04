$(document).ready(function() {
    const shutterBtn = $('#toggle-store')
    const lightBtn = $('#toggle-light')

    const nextSlideBtn = $('#next-slide')
    const prevSlideBtn = $('#prev-slide')

    const s = Snap('#meeting-room-svg')

    /* Turn ON / OFF light */
    const light = s.select('#LUMIERE-ON')
    lightBtn.on('click', function() {
        if ($('#LUMIERE-ON').hasClass('off')) {
            light.animate({ opacity: 0.7 }, 500, function() {
                $('#LUMIERE-ON').removeClass('off').addClass('on')
            })
        } else if (light.hasClass('on'))  {
            light.animate({ opacity: 0 }, 500, function() {
                $('#LUMIERE-ON').removeClass('on').addClass('off')
            })

        }
    });

    /* OPEN / CLOSE shutters */
    const shutterRight = s.select('#volets-D')
    const shutterRightClose = 'M 264.9,170.3 409.5,87.4 409.5,322.6 264.9,405.5 Z'
    const shutterRightOpen = 'M 264.9,170.3 409.5,87.4 409.5,88.5 264.9,171.6 Z'

    const shutterLeft = s.select('#volets--G')
    const shutterLeftClose = 'M 116.1,255.4 260.7,172.5 260.7,407.7 116.1,490.6 Z'
    const shutterLeftOpen = 'M 116.1,255.4 260.7,172.5 260.7,173.5 116.1,257.1 Z'

    const shutterRightMask = s.path(shutterRightOpen).attr('fill', '#fff')
    const shutterLeftMask = s.path(shutterLeftOpen).attr('fill', '#fff')

    shutterRight.attr({ mask: shutterRightMask })
    shutterLeft.attr({ mask: shutterLeftMask })

    const darkness = $('#ETEIND')

    shutterBtn.on('click', function() {
        // Close shutter
        if ($('#VOLETS-ON').hasClass('open')) {
            shutterRightMask.animate({
                d: shutterRightClose
            }, 600)
            shutterLeftMask.animate({
                d: shutterLeftClose
            }, 600, function() {
                $('#VOLETS-ON').removeClass('open').addClass('close')
            })
            darkness.animate({ opacity: 0.2 }, 500);
        }
        // Open shutter
        else if ($('#VOLETS-ON').hasClass('close')) {
            shutterRightMask.animate({
                d: shutterRightOpen
            }, 600)
            shutterLeftMask.animate({
                d: shutterLeftOpen
            }, 600, function() {
                $('#VOLETS-ON').removeClass('close').addClass('open')
            })
            darkness.animate({ opacity: 0 }, 500);
        }
    })

    /* Projector */
    const projBtn = $('#toggle-proj')
    const projector = $('#VIDEOPROJ-ON')

    projBtn.on('click', function() {
        const projection = s.select('#VIDEOPROJ-ON')
        if (projector.hasClass('off')) {
            projection.animate({ opacity: 1 }, 500, function() {
                projector.removeClass('off').addClass('on')
            })
        } else if (projector.hasClass('on')) {
            projection.animate({ opacity: 0 }, 500, function() {
                projector.removeClass('on').addClass('off')
            })
        }
    })

    nextSlideBtn.on('click', function() {
        const pcSlides = $('.pc-proj')
        let target = null
        let targetProj = null
        const currentSlide = $('.pc-proj.active')
        const currentSlideIndex = parseInt(currentSlide.attr('data-index'));
        const currentProj = $('#VIDEOPROJ-ON-' + currentSlideIndex)

        if (currentSlideIndex === pcSlides.length) {
            target = $('.pc-proj[data-index="1"]')
            targetProj = $('.proj[data-index="1"]')
        } else {
            target = $('.pc-proj[data-index="' + (currentSlideIndex + 1) + '"]')
            targetProj = $('.proj[data-index="' + (currentSlideIndex + 1) + '"]')
        }
        const svgCurrent = s.select('#' + currentSlide.attr('id'))
        const svgTarget = s.select('#' + target.attr('id'))
        const svgCurrentProj = s.select('#VIDEOPROJ-ON-' + currentSlideIndex)
        const svgTargetProj = s.select('#' + targetProj.attr('id'))

        svgCurrent.animate({ opacity: 0 }, 300, function() {
            currentSlide.removeClass('active')
            target.addClass('active')

            currentProj.removeClass('active')
            targetProj.addClass('active')
            svgTarget.animate({ opacity: 1 }, 300)
            svgCurrentProj.animate({ opacity: 0 }, 300, function() {
                svgTargetProj.animate({ opacity: 1 }, 300)
            })
        })
    })

    prevSlideBtn.on('click', function() {
        const pcSlides = $('.pc-proj')
        let target = null
        let targetProj = null
        const currentSlide = $('.pc-proj.active')
        const currentSlideIndex = parseInt(currentSlide.attr('data-index'));
        const currentProj = $('#VIDEOPROJ-ON-' + currentSlideIndex)

        if (currentSlideIndex === 1) {
            target = $('.pc-proj[data-index="' + pcSlides.length + '"]')
            targetProj = $('.proj[data-index="' + pcSlides.length + '"]')
        } else {
            target = $('.pc-proj[data-index="' + (currentSlideIndex - 1) + '"]')
            targetProj = $('.proj[data-index="' + (currentSlideIndex - 1) + '"]')
        }
        const svgCurrent = s.select('#' + currentSlide.attr('id'))
        const svgTarget = s.select('#' + target.attr('id'))
        const svgCurrentProj = s.select('#VIDEOPROJ-ON-' + currentSlideIndex)
        const svgTargetProj = s.select('#' + targetProj.attr('id'))

        svgCurrent.animate({ opacity: 0 }, 300, function() {
            currentSlide.removeClass('active')
            target.addClass('active')
            currentProj.removeClass('active')
            targetProj.addClass('active')
            svgTarget.animate({ opacity: 1 }, 300)
            svgCurrentProj.animate({ opacity: 0 }, 300, function() {
                svgTargetProj.animate({ opacity: 1 }, 300)
            })
        })
    })
})