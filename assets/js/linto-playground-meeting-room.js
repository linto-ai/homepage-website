$(document).ready(function() {
    window.lintoState = 'sleeping'
    window.lintoAnim = null
    window.lintoAnimSegments =   {
        sleeping: {
            start: 0,
            end: 90,
            endPreLoop: null
        },
        listening: {
            start: 91,
            end: 210,
            endPreLoop: 147
        },
        thinking: {
            start: 211,
            end: 315,
            endPreLoop: 260
        }
    }
    window.lintoUISound = new Audio()
        /* SVG */
    const s = Snap('#meeting-room-svg')
    const darkness = $('#ETEIND')
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

    /* Linto animation funcitons */

    let lintoSleep = function() {
        window.lintoState = 'sleeping'
        window.lintoAnim.goToAndPlay(window.lintoAnimSegments.sleeping.start, true)
    }

    let lintoListen = function() {
        window.lintoState = 'wakeup'
        window.lintoAnim.goToAndPlay(window.lintoAnimSegments.listening.endPreLoop, true)
    }

    let lintoThink = function() {
        window.lintoState = 'thinking'
        window.lintoAnim.goToAndPlay(window.lintoAnimSegments.thinking.endPreLoop, true)
    }

    /* Meeting room Animation functions */
    let lightOn = function() {
        const s = Snap('#meeting-room-svg')
        const light = s.select('#LUMIERE-ON')
        light.animate({ opacity: 0.7 }, 500, function() {
            $('#LUMIERE-ON').removeClass('off').addClass('on')
        })
    }
    let lightOff = function() {
        const s = Snap('#meeting-room-svg')
        const projector = $('#VIDEOPROJ-ON')
        const light = s.select('#LUMIERE-ON')
        light.animate({ opacity: 0 }, 500, function() {
            $('#LUMIERE-ON').removeClass('on').addClass('off')
        })
    }
    let projectorOn = function() {
        const s = Snap('#meeting-room-svg')
        const projector = $('#VIDEOPROJ-ON')
        const projection = s.select('#VIDEOPROJ-ON')
        projection.animate({ opacity: 1 }, 500, function() {
            projector.removeClass('off').addClass('on')
        })
    }
    let projectorOff = function() {
        const s = Snap('#meeting-room-svg')
        const projection = s.select('#VIDEOPROJ-ON')
        projection.animate({ opacity: 0 }, 500, function() {
            projector.removeClass('on').addClass('off')
        })
    }
    let slideNext = function()  {
        const s = Snap('#meeting-room-svg')

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
    }
    let slidePrev = function() {
        const s = Snap('#meeting-room-svg')

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
    }
    let closeShutters = function() {
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
    let openShutters = function() {
        shutterRight.attr({ mask: shutterRightMask })
        shutterLeft.attr({ mask: shutterLeftMask })
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

    let mqttConnectHandler = function(event) {
        console.log("mqtt up !")
    }

    let mqttConnectFailHandler = function(event) {
        console.log("Mqtt failed to connect : ")
        console.log(event)
    }

    let mqttErrorHandler = function(event) {
        console.log("An MQTT error occured : ", event.detail)
    }

    let mqttDisconnectHandler = function(event) {
        console.log("MQTT Offline")
    }

    let audioSpeakingOn = function(event) {
        console.log("Speaking")
    }

    let audioSpeakingOff = function(event) {
        console.log("Not speaking")
    }

    let commandAcquired = function(event) {
        console.log("Command acquired")
        lintoThink()
    }

    let commandPublished = function(event) {
        console.log("Command published id :", event.detail)
    }

    let hotword = function(event) {
        console.log("Hotword triggered : ", event.detail)

        // Play beep sound
        window.lintoUISound.src = '../assets/audio/linto/beep3.wav'
        window.lintoUISound.play()
        lintoListen()
    }

    let commandTimeout = function(event) {
        console.log("Command timeout, id : ", event.detail)
    }

    let sayFeedback = async function(event) {
        console.log("Saying : ", event.detail.behavior.say.text, " ---> Answer to : ", event.detail.transcript)

        // If no command found
        window.lintoUISound.src = '../assets/audio/linto/beep4.wav'
        window.lintoUISound.play()
        lintoSleep();
        await linto.say(linto.lang, event.detail.behavior.say.text)
    }

    let askFeedback = async function(event) {
        console.log("Asking : ", event.detail.behavior.ask.text, " ---> Answer to : ", event.detail.transcript)
        await linto.ask(linto.lang, event.detail.behavior.ask.text)
    }

    let streamingChunk = function(event) {
        if (event.detail.behavior.streaming.partial) {
            console.log("Streaming chunk received : ", event.detail.behavior.streaming.partial)
        }
        if (event.detail.behavior.streaming.text) {
            console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
        }

    }

    let streamingStart = function(event) {
        console.log("Streaming started with no errors")
    }

    let streamingFinal = function(event) {
        console.log("Streaming ended, here's the final transcript : ", event.detail.behavior.streaming.result)
    }

    let streamingFail = function(event) {
        console.log("Streaming cannot start : ", event.detail)
    }

    let customHandler = async function(event) {
        // Zoom picture
        if (event.detail.behavior.customAction.kind === 'shutter_off') {
            openShutters()
        }
        if (event.detail.behavior.customAction.kind === 'shutter_on') {
            closeShutters()
        }
        if (event.detail.behavior.customAction.kind === 'light_on') {
            lightOn()
        }
        if (event.detail.behavior.customAction.kind === 'light_off') {
            lightOff()
        }
        if (event.detail.behavior.customAction.kind === 'projector_on') {
            projectorOn()
        }
        if (event.detail.behavior.customAction.kind === 'projector_off') {
            projectorOff()
        }
        if (event.detail.behavior.customAction.kind === 'slide_next') {
            slideNext()
        }
        if (event.detail.behavior.customAction.kind === 'slide_previous') {
            slidePrev()
        }

        lintoSleep()
        console.log(`${event.detail.behavior.customAction.kind} fired`)
        console.log(event.detail.behavior)
        console.log(event.detail.transcript)
    }



    window.start = async function() {
        try {
            //window.linto = new Linto("https://stage.linto.ai/overwatch/local/web/login", "P3y0tRCHQB6orRzL", 10000) // LOCAL
            window.linto = new Linto("https://stage.linto.ai/overwatch/local/web/login", "IzpMpsZ6LZiUSpv3", 10000) // PROD

            // Some feedbacks for UX implementation
            linto.addEventListener("mqtt_connect", mqttConnectHandler)
            linto.addEventListener("mqtt_connect_fail", mqttConnectFailHandler)
            linto.addEventListener("mqtt_error", mqttErrorHandler)
            linto.addEventListener("mqtt_disconnect", mqttDisconnectHandler)
            linto.addEventListener("speaking_on", audioSpeakingOn)
            linto.addEventListener("speaking_off", audioSpeakingOff)
            linto.addEventListener("command_acquired", commandAcquired)
            linto.addEventListener("command_published", commandPublished)
            linto.addEventListener("command_timeout", commandTimeout)
            linto.addEventListener("hotword_on", hotword)
            linto.addEventListener("say_feedback_from_skill", sayFeedback)
            linto.addEventListener("ask_feedback_from_skill", askFeedback)
            linto.addEventListener("streaming_start", streamingStart)
            linto.addEventListener("streaming_chunk", streamingChunk)
            linto.addEventListener("streaming_final", streamingFinal)
            linto.addEventListener("streaming_fail", streamingFail)
            linto.addEventListener("custom_action_from_skill", customHandler)
            await linto.login()
            linto.startAudioAcquisition(true, "linto", 0.99) // Uses hotword built in WebVoiceSDK by name / model / threshold (0.99 is fine enough)
            linto.startCommandPipeline()
            $('#loading').addClass('hidden')


            const animationContainer = document.getElementById('linto-animation')
            window.lintoAnim = lottie.loadAnimation({
                container: animationContainer, // the dom element that will contain the animation
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: '../assets/json/linto-full.json', // the path to the animation json
                rendererSettings: {
                    className: 'linto-animation'
                }
            })

            window.lintoAnim.addEventListener('enterFrame', function(e) {

                if (window.lintoState === 'sleeping') {
                    if (e.currentTime >= window.lintoAnimSegments.sleeping.end) {
                        window.lintoAnim.goToAndPlay(window.lintoAnimSegments.sleeping.start, true)
                    }
                } else if (window.lintoState === 'wakeup') {
                    if (e.currentTime >= window.lintoAnimSegments.listening.end) {
                        window.lintoAnim.goToAndPlay(window.lintoAnimSegments.listening.endPreLoop, true)
                    }
                } else if (window.lintoState === 'thinking') {
                    if (e.currentTime >= window.lintoAnimSegments.thinking.end) {
                        window.lintoAnim.goToAndPlay(window.lintoAnimSegments.thinking.endPreLoop, true)
                    }
                }
            })

            return true
        } catch (e) {
            console.log(e)
            return e.message
        }

    }

    start()
})