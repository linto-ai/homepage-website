window.streamingContent = ''
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
let getActiveTitle = function() {
    const currentTitle = $('.playground-webpage-content-block.active .playground-content-block__title')
    return currentTitle.html();
}
let getActiveContent = function() {
    const currentContent = $('.playground-webpage-content-block.active .playground-content-block__content')
    return currentContent.html();
}
let goToBlock = function(direction) {
    const block = document.getElementById('playground-webpage-content')

    const currentBlock = $('.playground-webpage-content-block.active')
    const currentBlockIndex = parseInt(currentBlock.attr('data-index'))
    const blockCount = parseInt($('.playground-webpage-content-block').length)

    let targetIndex = 0
    if (direction === 'next') {
        if (currentBlockIndex === blockCount) {
            targetIndex = 1
        } else {
            targetIndex = currentBlockIndex + 1
        }

    } else if (direction === 'prev') {
        if (currentBlockIndex === 1) {
            targetIndex = blockCount
        } else {
            targetIndex = currentBlockIndex - 1
        }
    }
    const targetBlock = $('.playground-webpage-content-block[data-index="' + targetIndex + '"]')
    const targetOffset = targetBlock[0].offsetTop - 60

    currentBlock.removeClass('active')
    targetBlock.addClass('active')

    block.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
    });
}

let enableAccessibility = function() {
    const playground = $('#playground-webpage')
    const playgroundTitle = $('#playground-title')
    playground.addClass('accessibility')
    playgroundTitle.addClass('accessibility')
}
let disableAccessibility = function() {
    const playground = $('#playground-webpage')
    const playgroundTitle = $('#playground-title')
    playground.removeClass('accessibility')
    playgroundTitle.removeClass('accessibility')
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

    const audioPlayer = document.getElementById('podcast')

    if (!audioPlayer.paused) {
        audioPlayer.volume = 0.1
        audioPlayer.setAttribute('data-tmppause', true)
    }

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
        $('#dictation').html(window.streamingContent + event.detail.behavior.streaming.partial)
    }

    if (event.detail.behavior.streaming.text) {
        console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
        window.streamingContent += event.detail.behavior.streaming.text + '<br/>'
        $('#dictation').html(window.streamingContent)
    }

}

let streamingStart = function(event) {
    console.log("Streaming started with no errors")
}

let streamingFinal = function(event) {
    console.log("Streaming ended, here's the final transcript : ", event.detail.behavior.streaming.result)

    const result = JSON.parse(event.detail.behavior.streaming.result)
        //window.streamingContent += ' ' + result.text
    $('#dictation').html(window.streamingContent)
}
let streamingFail = function(event) {
    console.log("Streaming cannot start : ", event.detail)
}

let customHandler = async function(event) {
    // Zoom picture
    if (event.detail.behavior.customAction.kind === 'picture_zoom_in') {
        $('.lightbox__img').trigger('click')
    }
    // Reduce picture
    if (event.detail.behavior.customAction.kind === 'picture_zoom_out') {
        $('#lightbox').remove()
    }
    // Podcast play
    if (event.detail.behavior.customAction.kind === 'podcast_start') {
        document.getElementById('podcast').play()
    }

    // Podcast stop
    if (event.detail.behavior.customAction.kind === 'podcast_stop' || event.detail.behavior.customAction.kind === 'podcast_pause') {
        const audioPlayer = document.getElementById('podcast')
        if (!audioPlayer.paused) {
            document.getElementById('podcast').pause()
        }
    }
    // Slide next
    if (event.detail.behavior.customAction.kind === 'slide_next') {
        $('#playground-slider').slick('slickNext')
    }
    // Slide previous
    if (event.detail.behavior.customAction.kind === 'slide_previous') {
        $('#playground-slider').slick('slickPrev')
    }

    // Slide previous
    if (event.detail.behavior.customAction.kind === 'block_next') {
        goToBlock('next')
    }
    if (event.detail.behavior.customAction.kind === 'block_previous') {
        goToBlock('prev')
    }
    if (event.detail.behavior.customAction.kind === 'read_title') {
        const content = getActiveTitle();
        await linto.say(linto.lang, content)
    }
    if (event.detail.behavior.customAction.kind === 'read_content') {
        const content = getActiveContent();
        await linto.say(linto.lang, content)
    }
    if (event.detail.behavior.customAction.kind === 'accesibility_on') {
        enableAccessibility()
    }
    if (event.detail.behavior.customAction.kind === 'accesibility_off') {
        disableAccessibility()
    }
    lintoSleep()

    const audioPlayer = document.getElementById('podcast')
    if (audioPlayer.getAttribute('data-tmppause') === true || audioPlayer.getAttribute('data-tmppause') === 'true') {
        audioPlayer.volume = 1
        audioPlayer.setAttribute('data-tmppause', false)
    }
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

        $('#toggle-streaming').on('click', function() {
            if ($(this).hasClass('disabled'))  {
                $(this).removeClass('disabled').addClass('enabled')
                $(this).html('Dictée activée')
                linto.stopCommandPipeline();
                linto.startStreaming()
            } else if ($(this).hasClass('enabled'))  {
                $(this).removeClass('enabled').addClass('disabled')
                $(this).html('Dictée en pause')
                linto.stopStreaming()
                linto.startCommandPipeline()

            }

        })
        return true
    } catch (e) {
        console.log(e)
        return e.message
    }

}

start()