window['lintoState'] = 'sleeping'
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

let lintoSleep = function() {
    window['lintoState'] = 'sleeping'
    window.lintoAnim.goToAndPlay(window.lintoAnimSegments.sleeping.start, true)
}

let lintoListen = function() {
    window['lintoState'] = 'wakeup'
    window.lintoAnim.goToAndPlay(window.lintoAnimSegments.listening.start, true)
    window.lintoAnim.setSpeed(1.2)
}

let lintoThink = function() {
    window.lintoAnim['lintoState'] = 'thinking'
    window.lintoAnim.goToAndPlay(window.lintoAnimSegments.thinking.start, true)
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
}

let commandPublished = function(event) {
    console.log("Command published id :", event.detail)
}

let hotword = function(event) {
    console.log("Hotword triggered : ", event.detail)
    lintoListen()
}

let commandTimeout = function(event) {
    console.log("Command timeout, id : ", event.detail)
}

let sayFeedback = async function(event) {
    console.log("Saying : ", event.detail.behavior.say.text, " ---> Answer to : ", event.detail.transcript)
    await linto.say(linto.lang, event.detail.behavior.say.text)
}

let askFeedback = async function(event) {
    console.log("Asking : ", event.detail.behavior.ask.text, " ---> Answer to : ", event.detail.transcript)
    await linto.ask(linto.lang, event.detail.behavior.ask.text)
}

let streamingChunk = function(event) {
    if (event.detail.behavior.streaming.partial)
        console.log("Streaming chunk received : ", event.detail.behavior.streaming.partial)
    if (event.detail.behavior.streaming.text)
        console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
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

let customHandler = function(event) {
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
    if (event.detail.behavior.customAction.kind === 'podcast_stop') {
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

            if (window['lintoState'] === 'sleeping') {
                if (e.currentTime >= window.lintoAnimSegments.sleeping.end) {
                    window.lintoAnim.goToAndPlay(window.lintoAnimSegments.sleeping.start, true)
                }
            } else if (window['lintoState'] === 'wakeup') {
                if (e.currentTime >= window.lintoAnimSegments.listening.end) {
                    window.lintoAnim.setSpeed(1)
                    window.lintoAnim.goToAndPlay(window.lintoAnimSegments.listening.endPreLoop, true)
                }
            } else if (window['lintoState'] === 'thinking') {
                if (e.currentTime >= window.lintoAnimSegments.thinking.end) {
                    window.lintoAnim.goToAndPlay(window.lintoAnimSegments.thinking.endPreLoop, true)
                }
            }
        })
        $('#linto-sleeping').on('click', function() {
            lintoSleep()
        })

        $('#linto-listening').on('click', function() {
            lintoListen()
        })

        $('#linto-thinking').on('click', function() {
            lintoThink()
        })



        return true
    } catch (e) {
        console.log(e)
        return e.message
    }

}

start()