class ChatBot {
    constructor(data) {
        /* GLOBAL */
        this.chatbot = null
        this.chatbotEnabled = false
        this.chatbotMode = ''
        this.debug = false

        /* LINTO CHATBOT CONFIG */
        this.lintoWebHost = '' // required
        this.lintoWebToken = '' // required

        /* STATES */
        this.lintoState = 'sleeping'
        this.streamingMode = 'vad'
        this.writingTarget = null
        this.streamingContent = ''

        /* ELEMENTS */
        this.lintoCornerAnim = null
        this.lintoAnimationContainer = null
        this.lintoAnimation = null
        this.showLintoFeedback = false

        this.lintoCustomEvents = []

        this.beep = null

        this.init(data)
    }

    async init(data) {
        // Set custom parameters
        if (!!data) {
            // Debug 
            if (!!data.debug) {
                this.debug = data.debug
            }
            if (!!data.chatbotMode) {
                this.chatbotMode = data.chatbotMode
            }
            // Web host url
            if (!!data.lintoWebHost) {
                this.lintoWebHost = data.lintoWebHost
            }
            // Web host Token
            if (!!data.lintoWebToken) {
                this.lintoWebToken = data.lintoWebToken
            }

            if (!!data.lintoCustomEvents) {
                this.lintoCustomEvents = data.lintoCustomEvents
            }
        }
        // First initialisation
        if (!this.chatbotEnabled) {
            // HTML
            let jhtml = `
            <div id="linto-chatbot-corner" class="visible flex row">
                <button id="linto-chatbot-init-btn"></button>
                <div id="linto-chatbot-init-frame" class="flex col hidden">
                <span>Activez la saisie vocale pour poser vos questions oralement.<br/><br/>Cliquez sur le bouton ou dîtes <strong>"LinTO"</strong> pour activer la saisie vocale</span>
                <div id="linto-chatbot-init-frame-btn" class="flex row">
                    <button id="init-frame-btn-enable"class="enable">Activer</button>
                    <button id="init-frame-btn-close" class="close">Fermer</button>
                </div>
                </div>
            </div>`

            const chatbotWrapper = document.getElementById('chatbot-wrapper')
            chatbotWrapper.innerHTML = jhtml

            const initBtn = document.getElementById('linto-chatbot-init-btn')
            const closeFrameBtn = document.getElementById('init-frame-btn-close')
            const enableLintoBtn = document.getElementById('init-frame-btn-enable')

            this.lintoCornerAnim = lottie.loadAnimation({
                container: initBtn,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/assets/json/linto-sleep.json',
                rendererSettings: {
                    className: 'linto-animation'
                }
            })

            // Toggle initialisation frame
            initBtn.onclick = (e) => {
                this.toggleInitFrame()
            }

            // Close initialisation frame
            closeFrameBtn.onclick = (e) => {
                this.toggleInitFrame()
            }

            // Init linto web client
            enableLintoBtn.onclick = (e) => {
                if (this.chatbotMode === 'minimal-streaming') {
                    this.setChatbotMinimal()
                } else if (this.chatbotMode === 'multi-modal') {
                    this.setChatbotMultiModal()
                }
                this.closeInitFrame()
                this.initLintoWeb()
            }
            this.beep = new Audio('/assets/audio/beep.mp3')
            this.beep.volume = 0.1
        }
    }
    toggleInitFrame() {
        const initBtn = document.getElementById('linto-chatbot-init-btn')
        const initFrame = document.getElementById('linto-chatbot-init-frame')

        if (initFrame.classList.contains('hidden')) {
            initFrame.classList.remove('hidden')
            this.lintoCornerAnim.destroy()
            initBtn.innerHTML = '<span class="linto-icon"></span>'
        } else {
            initFrame.classList.add('hidden')
            initBtn.innerHTML = ''

            this.lintoCornerAnim = lottie.loadAnimation({
                container: initBtn,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/assets/json/linto-sleep.json',
                rendererSettings: {
                    className: 'linto-animation'
                }
            })
        }
    }
    closeInitFrame() {
        const initBtn = document.getElementById('linto-chatbot-init-btn')
        const initFrame = document.getElementById('linto-chatbot-init-frame')
        initFrame.classList.add('hidden')
        initBtn.innerHTML = ''

        this.lintoCornerAnim = lottie.loadAnimation({
            container: initBtn,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/json/linto-sleep.json',
            rendererSettings: {
                className: 'linto-animation'
            }
        })
    }

    /* LinTO Chatbot MINIMAL MODE */
    setChatbotMinimal() {
        let jhtml = ''
        const chatbotWrapper = document.getElementById('chatbot-wrapper')
        if (this.chatbotMode === 'minimal-streaming') {
            jhtml = `
            <div id="chatbot-minimal" class="${this.chatbotMode} flex row hidden">
              <button id="chatbot-ui-close"></button>
              <div class="chatbot-container flex1 flex row">
                  <div id="linto-chatbot-animation" class="chatbot-animation flex col"></div>
                  <div class="chatbot-content flex col flex1">
                      <div id="chatbot-content-previous" class="chatbot-content-previous"></div>
                      <div id="chatbot-content-current" class="chatbot-content-current flex col"></div>
                    </div>
                </div>
            </div>`
        }
        chatbotWrapper.innerHTML += jhtml
        this.lintoAnimationContainer = document.getElementById('linto-chatbot-animation')

        const chatbotUiCloseBtn = document.getElementById('chatbot-ui-close')
        chatbotUiCloseBtn.onclick = (e) => {
            this.stopAll()
            this.hideChatbotMinimal()
        }

        const chatbotLintoBtn = document.getElementById('linto-chatbot-init-btn')
        chatbotLintoBtn.onclick = (e) => {
            this.showChatbotMinimal()
            this.chatbot.startStreaming()
        }

    }
    hideChatbotMinimal() {
        const uiBtn = document.getElementById('linto-chatbot-corner')
        const chatbotUi = document.getElementById('chatbot-minimal')
        if (chatbotUi.classList.contains('visible')) {
            chatbotUi.classList.add('hidden')
            chatbotUi.classList.remove('visible')
            uiBtn.classList.add('visible')
            uiBtn.classList.remove('hidden')
            this.lintoState = 'sleeping'
            this.updateCurrentUiContent('')
            this.updatePrevioustUiContent('')
        }
    }
    showChatbotMinimal() {
        const uiBtn = document.getElementById('linto-chatbot-corner')
        const chatbotUi = document.getElementById('chatbot-minimal')
        if (chatbotUi.classList.contains('hidden')) {
            chatbotUi.classList.remove('hidden')
            chatbotUi.classList.add('visible')
            uiBtn.classList.remove('visible')
            uiBtn.classList.add('hidden')
            this.lintoState = 'listening'
            this.setLintoAnimation('listening')
        }
    }
    setLintoAnimation(name) { // Lottie animations 
        let jsonPath = ''
        if (name === 'listening') {
            jsonPath = '/assets/json/microphone.json'
        } else if (name === 'thinking') {
            jsonPath = '/assets/json/linto-think.json'
        } else if (name === 'talking') {
            jsonPath = '/assets/json/linto-talking.json'
        } else if (name === 'sleep') {
            jsonPath = '/assets/json/linto-sleep.json'
        } else if (name === 'destroy') {
            this.lintoAnimation.destroy()
        }
        if (this.lintoAnimation !== null && name !== 'destroy') {
            this.lintoAnimation.destroy()
        }
        if (name !== 'destroy') {
            this.lintoAnimation = lottie.loadAnimation({
                container: this.lintoAnimationContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: jsonPath,
                rendererSettings: {
                    className: 'linto-animation'
                }
            })
        }
    }
    updateCurrentUiContent(value) {
        const currentContent = document.getElementById('chatbot-content-current')
        currentContent.innerHTML = value
    }
    updatePrevioustUiContent(value) {
        const currentContent = document.getElementById('chatbot-content-previous')
        currentContent.innerHTML = value
    }

    /* LinTO Chatbot MULTI-MODAL MODE */
    setChatbotMultiModal() {
        let jhtml = `
        <div id="chatbot-multi-modal" class="flex col hidden">
            <div class="header flex row">
                <span class="chatbot-mm-title flex1">LinTO Chatbot</span>
                <div class="chatbot-mm-actions">
                    <button id="chatbot-mm-mic-mute" class="chatbot-mm-actions-btn"><span class="icon mic mute"></span></button>
                    <button id="chatbot-mm-collapse" class="chatbot-mm-actions-btn"><span class="icon collapse"></span></button>
                    <button id="chatbot-mm-close" class="chatbot-mm-actions-btn"><span class="icon close"></span></button>
                </div>
            </div>
            <div class="body flex1 flex col">
              <div id="chatbot-mm-content" class="flex col">
              </div>
            </div>
            <div class="footer flex row">
                <button id="chatbot-mm-mic"><span class="icon"></span></button>
                <span id="chatbot-mm-input" class="flex1" contenteditable></span>
                <button id="chatbot-mm-submit"><span class="icon"></span></button>
            </div>
        </div>
        `
        const chatbotWrapper = document.getElementById('chatbot-wrapper')
        chatbotWrapper.innerHTML += jhtml

        const chatbotLintoBtn = document.getElementById('linto-chatbot-init-btn')
        chatbotLintoBtn.onclick = (e) => {
            this.showChatbotMultiModal()
        }

        const micBtn = document.getElementById('chatbot-mm-mic')
        micBtn.onclick = (e) => {
            this.chatbot.startStreaming()
            micBtn.classList.add('streaming')
        }

        const collapseBtn = document.getElementById('chatbot-mm-collapse')
        collapseBtn.onclick = (e) => {
            this.hideChatbotMultiModal()
        }

        const chatbotInput = document.getElementById('chatbot-mm-input')
        const chatbotInputSubmit = document.getElementById('chatbot-mm-submit')
        chatbotInputSubmit.onclick = (e) => {
            let content = chatbotInput.innerHTML
            if (content.length > 0) {
                this.updateMultiModalUser(content)
                this.chatbot.sendChatbotText(content)
                chatbotInput.innerHTML = ''
            }
        }
    }
    showChatbotMultiModal(value) {
        const multiModal = document.getElementById('chatbot-multi-modal')
        const chatbotLintoBtn = document.getElementById('linto-chatbot-init-btn')
        multiModal.classList.remove('hidden')
        multiModal.classList.add('visible')
        chatbotLintoBtn.classList.remove('visible')
        chatbotLintoBtn.classList.add('hidden')
        if (!!value && value === 'streaming') {
            const micBtn = document.getElementById('chatbot-mm-mic')
            micBtn.classList.add('streaming')
        }
    }
    hideChatbotMultiModal() {
        const multiModal = document.getElementById('chatbot-multi-modal')
        const chatbotLintoBtn = document.getElementById('linto-chatbot-init-btn')
        multiModal.classList.remove('visible')
        multiModal.classList.add('hidden')
        chatbotLintoBtn.classList.remove('hidden')
        chatbotLintoBtn.classList.add('visible')
            //this.stopAll()
    }
    updateMultiModalUser(content) {
        const multiModalContent = document.getElementById('chatbot-mm-content')
        let jhtml = `
        <div class="chatbot-mm-content-item user flex row">
          <span class="content">${content}</span>
        </div>`
        multiModalContent.innerHTML += jhtml
    }
    updateMultiModalBot(content) {
        const multiModalContent = document.getElementById('chatbot-mm-content')
        let jhtml = `
      <div class="chatbot-mm-content-item bot flex row">
        <span class="content">${content}</span>
      </div>`
        multiModalContent.innerHTML += jhtml
    }
    updateMultiModalInput(content) {
        const multiModalInput = document.getElementById('chatbot-mm-input')
        multiModalInput.innerHTML = content
    }

    /* LINTO EVENTS LISTENERS */
    mqttConnectHandler = (event) => {
        if (this.debug) {
            console.log("MQTT: connected")
        }
    }
    mqttConnectFailHandler = (event) => {
        if (this.debug) {
            console.log("MQTT: failed to connect")
            console.log(event)
        }
    }
    mqttErrorHandler = (event) => {
        if (this.debug) {
            console.log("MQTT: error")
            console.log(event.detail)
        }
    }
    mqttDisconnectHandler = (event) => {
        if (this.debug) {
            console.log("MQTT: Offline")
        }
    }
    audioSpeakingOn = (event) => {
        if (this.debug) {
            console.log("Speaking")
        }
    }
    audioSpeakingOff = (event) => {
        if (this.debug) {
            console.log("Not speaking")
        }
    }
    commandAcquired = (event) => {
        if (this.debug) {
            console.log("Command acquired", event)
        }
    }
    commandPublished = (event) => {
        if (this.debug) {
            console.log("Command published id :", event.detail)
        }
    }
    hotword = (event) => {
        if (this.debug) {
            console.log("Hotword triggered : ", event.detail)
        }
        if (this.chatbotMode === 'minimal-streaming') {
            this.showChatbotMinimal()
        } else if (this.chatbotMode === 'multi-modal') {
            this.showChatbotMultiModal('streaming')
        }
    }
    commandTimeout = (event) => {
        if (this.debug) {
            console.log("Command timeout, id : ", event.detail)
        }
    }
    sayFeedback = async(event) => {
        if (this.debug) {
            console.log("Saying : ", event.detail.behavior.say.text, " ---> Answer to : ", event.detail.transcript)
        }
    }
    say = async(text) =>  {
        const toSay = await this.chatbot.say('fr-FR', text)
        return toSay
    }
    askFeedback = async(event) => {
        if (this.debug) {
            console.log("Asking : ", event.detail.behavior.ask.text, " ---> Answer to : ", event.detail.transcript)
        }
    }
    streamingChunk = (event) => {
        if (this.streamingMode === 'vad') {
            if (event.detail.behavior.streaming.partial) {
                if (this.debug) {
                    console.log("Streaming chunk received : ", event.detail.behavior.streaming.partial)
                }
                if (this.chatbotMode === 'minimal-streaming') {
                    this.updateCurrentUiContent(event.detail.behavior.streaming.partial)
                } else if (this.chatbotMode === 'multi-modal') {
                    this.updateMultiModalInput(event.detail.behavior.streaming.partial)
                }

            }
            if (event.detail.behavior.streaming.text) {
                if (this.debug) {
                    console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
                }
                if (this.chatbotMode === 'minimal-streaming') {
                    this.updateCurrentUiContent(event.detail.behavior.streaming.text)
                } else if (this.chatbotMode === 'multi-modal') {
                    this.updateMultiModalUser(event.detail.behavior.streaming.text)
                    this.updateMultiModalInput('')
                    const micBtn = document.getElementById('chatbot-mm-mic')
                    micBtn.classList.remove('streaming')
                }
                this.chatbot.stopStreaming()
                this.setLintoAnimation('thinking')
                setTimeout(() => {
                    this.chatbot.sendCommandText(event.detail.behavior.streaming.text)
                }, 1000)
            }
        } else if (this.streamingMode === 'vad-custom' && this.writingTarget !== null) {
            if (event.detail.behavior.streaming.partial) {
                if (this.debug) {
                    console.log("Streaming chunk received : ", event.detail.behavior.streaming.partial)
                }
                this.writingTarget.innerHTML = event.detail.behavior.streaming.partial
            }
            if (event.detail.behavior.streaming.text) {
                if (this.debug) {
                    console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
                }
                this.writingTarget.innerHTML = event.detail.behavior.streaming.text

                this.chatbot.stopStreaming()
                this.chatbot.startStreamingPipeline()
            }
        } else if (this.streamingMode === 'infinite' && this.writingTarget !== null) {
            if (event.detail.behavior.streaming.partial) {
                if (this.debug) {
                    console.log("Streaming chunk received : ", event.detail.behavior.streaming.partial)
                }
                if (event.detail.behavior.streaming.partial !== 'stop') {
                    this.writingTarget.innerHTML = this.streamingContent + (this.streamingContent.length > 0 ? '\n' : '') + event.detail.behavior.streaming.partial
                }
            }
            if (event.detail.behavior.streaming.text) {
                if (this.debug) {
                    console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
                }
                if (event.detail.behavior.streaming.text === 'stop') {
                    this.chatbot.stopStreaming()
                } else {
                    this.streamingContent += (this.streamingContent.length > 0 ? '\n' : '') + event.detail.behavior.streaming.text
                    this.writingTarget.innerHTML = this.streamingContent
                }

            }
        }
    }
    customStreaming = (streamingMode, target) => {
        this.beep.play()
        this.streamingMode = streamingMode
        this.writingTarget = document.getElementById(target)
        this.chatbot.stopStreamingPipeline()
        this.chatbot.startStreaming()
    }
    streamingStart = (event) => {
        this.beep.play()
        if (this.debug) {
            console.log("Streaming started with no errors")
        }
    }
    streamingStop = (event) => {
        if (this.debug) {
            console.log("Streaming stop")
        }
        this.streamingMode = 'vad'
        this.writingTarget = null
    }
    streamingFinal = (event) => {
        if (this.debug) {
            console.log("Streaming ended, here's the final transcript : ", event.detail.behavior.streaming.result)
        }
    }
    streamingFail = (event) => {
        if (this.debug) {
            console.log("Streaming cannot start : ", event.detail)
        }
        if (event.detail.behavior.streaming.status === 'chunk') {
            this.chatbot.stopStreaming()
            this.chatbot.stopStreamingPipeline()
        }

        this.lintoCornerAnim.destroy()
        this.hideChatbotMultiModal()

        const initBtn = document.getElementById('linto-chatbot-init-btn')
        setTimeout(() => {
            this.lintoCornerAnim = lottie.loadAnimation({
                container: initBtn,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: '/assets/json/error.json',
                rendererSettings: {
                    className: 'linto-animation'
                }
            })
            this.chatbot.startStreamingPipeline()

            setTimeout(() => {
                this.lintoCornerAnim.destroy()
                this.lintoCornerAnim = lottie.loadAnimation({
                    container: initBtn,
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    path: '/assets/json/linto-sleep.json',
                    rendererSettings: {
                        className: 'linto-animation'
                    }
                })
            }, 500);
        }, 300);

    }
    textPublished = (e) => {
        if (this.debug) {
            console.log('textPublished', e)
        }
    }
    chatbotAcquired = (e) => {
        if (this.debug) {
            console.log('chatbotAcquired', e)
        }
    }
    chatbotPublished = (e) => {
        if (this.debug) {
            console.log('chatbotPublished', e)
        }
    }
    actionPublished = (e) => {
        if (this.debug) {
            console.log('actionPublished', e)
        }
    }
    actionFeedback = (e) => {
        if (this.debug) {
            console.log('actionFeedback', e)
        }
    }
    customHandler = async(e) => {
        if (this.debug) {
            console.log('customHandler', e)
        }
    }
    askFeedback = (event) => {
        if (this.debug) {
            console.log('Ask feedback', event)
        }
    }
    setHandler = (label, func) => {
        this.chatbot.addEventListener(label, func)
    }
    chatbotFeedback = async(e) => {
        if (this.debug) {
            console.log('chatbot feedback', e)
        }
        if (!!e.detail && !!e.detail.behavior) {
            let ask = e.detail.behavior.chatbot.ask
            let answer = e.detail.behavior.chatbot.answer.text
                //let data = e.detail.behavior.chatbot.answer.data // chatbot answers (links)

            if (this.chatbotMode === 'minimal-streaming') {
                this.updateCurrentUiContent(answer)
                this.updatePrevioustUiContent(ask)
                this.setLintoAnimation('talking')
            }
            if (this.chatbotMode === 'multi-modal') {
                this.updateMultiModalBot(answer)
            }

            // Response
            let sayResp = await this.say(answer)
            if (!!sayResp) {
                this.stopAll()
                if (this.chatbotMode !== 'multi-modal') {
                    this.hideChatbotMinimal()
                }
            }
        }
    }
    stopAll() {
        this.chatbot.stopStreaming()
        this.chatbot.stopSpeech()
        this.setLintoAnimation('destroy')
    }
    initLintoWeb = async() => {
        // Set chatbot
        this.chatbot = new Linto(this.lintoWebHost, this.lintoWebToken)

        // Chatbot events
        this.chatbot.addEventListener("mqtt_connect", this.mqttConnectHandler)
        this.chatbot.addEventListener("mqtt_connect_fail", this.mqttConnectFailHandler)
        this.chatbot.addEventListener("mqtt_error", this.mqttErrorHandler)
        this.chatbot.addEventListener("mqtt_disconnect", this.mqttDisconnectHandler)
        this.chatbot.addEventListener("command_acquired", this.commandAcquired)
        this.chatbot.addEventListener("command_published", this.commandPublished)
        this.chatbot.addEventListener("speaking_on", this.audioSpeakingOn)
        this.chatbot.addEventListener("speaking_off", this.audioSpeakingOff)
        this.chatbot.addEventListener("streaming_start", this.streamingStart)
        this.chatbot.addEventListener("streaming_stop", this.streamingStop)
        this.chatbot.addEventListener("streaming_chunk", this.streamingChunk)
        this.chatbot.addEventListener("streaming_final", this.streamingFinal)
        this.chatbot.addEventListener("streaming_fail", this.streamingFail)
        this.chatbot.addEventListener("hotword_on", this.hotword)
        this.chatbot.addEventListener("ask_feedback_from_skill", this.askFeedback)
        this.chatbot.addEventListener("say_feedback_from_skill", this.sayFeedback)
        this.chatbot.addEventListener("custom_action_from_skill", this.customHandler)
        this.chatbot.addEventListener("startRecording", this.textPublished)
        this.chatbot.addEventListener("chatbot_acquired", this.chatbotAcquired)
        this.chatbot.addEventListener("chatbot_published", this.chatbotPublished)
        this.chatbot.addEventListener("chatbot_feedback", this.chatbotFeedback)
        this.chatbot.addEventListener("action_published", this.actionPublished)
        this.chatbot.addEventListener("action_feedback", this.actionFeedback)
        this.chatbot.addEventListener("chatbot_feedback_from_skill", this.chatbotFeedback)

        if (this.lintoCustomEvents.length > 0) {
            for (let event of this.lintoCustomEvents) {
                this.setHandler(event.flag, event.func)
            }
        }

        // Chatbot login
        await this.chatbot.login()

        this.chatbot.startAudioAcquisition(true, "linto", 0.99)
        this.chatbot.startStreamingPipeline()
        this.chatbotEnabled = true

        this.lintoCornerAnim.destroy()
        const initBtn = document.getElementById('linto-chatbot-init-btn')
        this.lintoCornerAnim = lottie.loadAnimation({
            container: initBtn,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/assets/json/validation.json',
            rendererSettings: {
                className: 'linto-animation'
            }
        })
        this.lintoCornerAnim.onComplete = () => {
            setTimeout(() => {
                this.lintoCornerAnim.destroy()
                this.lintoCornerAnim = lottie.loadAnimation({
                    container: initBtn,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: '/assets/json/linto-sleep.json',
                    rendererSettings: {
                        className: 'linto-animation'
                    }
                })
            }, 500)
        }
    }
}