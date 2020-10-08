$(document).ready(function() {
    const shutterBtn = $('#toggle-store')
    const lightBtn = $('#toggle-light')

    const s = Snap('#meeting-room-svg')

    /* Turn ON / OFF light */
    const light = s.select('#LUMIERE-ON')
    lightBtn.on('click', function() {

        console.log(light)
        if ($('#LUMIERE-ON').hasClass('off')) {
            light.animate({ opacity: 1 }, 500, function() {
                console.log('cb1')
                $('#LUMIERE-ON').removeClass('off').addClass('on')
            })
        } else if (light.hasClass('on'))  {
            light.animate({ opacity: 0 }, 500, function() {
                console.log('cb2')
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
    projBtn.on('click', function() {
        const projection = s.select('#VIDEOPROJ-ON')
        if ($('#VIDEOPROJ-ON').hasClass('off')) {
            projection.animate({ opacity: 1 }, 500, function() {
                $('#VIDEOPROJ-ON').removeClass('off').addClass('on')
            })
        } else if ($('#VIDEOPROJ-ON').hasClass('on')) {
            projection.animate({ opacity: 0 }, 500, function() {
                $('#VIDEOPROJ-ON').removeClass('on').addClass('off')
            })
        }

    })





});

/*
<!-- mask volets -->
<g id="mask_x5F_volets">
             <polygon id="mask_x5F_volet_x5F_d_1_" class="st76" points="264.9,170.3 409.5,87.4 409.5,322.6 264.9,405.5 	"/>
             <polygon id="mask_x5F_volet_x5F_g" class="st76" points="116.1,255.4 260.7,172.5 260.7,407.7 116.1,490.6 	"/>
             <polygon id="mask_x5F_volet_x5F_d_2_" class="st86" points="264.9,170.3 409.5,87.4 409.5,88.5 264.9,171.6 	"/>
             <polygon id="mask_x5F_volet_x5F_g_1_" class="st86" points="116.1,255.4 260.7,172.5 260.7,173.5 116.1,257.1 	"/>
           </g>*/