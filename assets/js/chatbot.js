class ChatBot {
    constructor(data) {
        /* REQUIRED */
        this.containerId = null // reuqired
        this.lintoWebHost = '' // required
        this.lintoWebToken = '' // required  

        /* GLOBAL */
        this.chatbot = null
        this.chatbotEnabled = false
        this.chatbotContainer = null
        this.debug = false

        /* STATES */
        this.streamingMode = 'vad'
        this.writingTarget = null
        this.streamingContent = ''

        /* Animations */
        this.lintoRightCornerAnimation = null
        this.lintoLeftCornerAnimation = null

        /* ELEMENTS */
        this.chatbotFeedbackContent = []
        this.beep = null

        /* CUSTOM EVENTS */
        this.lintoCustomEvents = []

        /* INITIALIZATION */
        this.init(data)
    }

    async init(data) {
        // Set custom parameters
        if (!!data) {
            // Debug 
            if (!!data.debug) {
                this.debug = data.debug
            }
            // Web host url
            if (!!data.lintoWebHost) {
                this.lintoWebHost = data.lintoWebHost
            }
            // Web host Token
            if (!!data.lintoWebToken) {
                this.lintoWebToken = data.lintoWebToken
            }
            // Container ID
            if (!!data.containerId) {
                this.containerId = data.containerId
                this.chatbotContainer = document.getElementById(this.containerId)
            }
            // Custom events
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
                <button id="chatbot-close" class="hidden"><span class="icon"></span></button>
                <div id="linto-chatbot-init-frame" class="flex col hidden">
                  <span>Activez la saisie vocale pour poser vos questions oralement.<br/><br/>Cliquez sur le bouton ou dîtes <strong>"LinTO"</strong> pour activer la saisie vocale</span>
                  <div id="linto-chatbot-init-frame-btn" class="flex col">
                    <button id="init-frame-btn-enable-mm" class="enable">Mode multi-modal</button>
                    <button id="init-frame-btn-enable-ms" class="enable">Mode minimal-streaming</button>
                    <button id="init-frame-btn-close" class="close">Fermer</button>
                  </div>
                </div>
            </div>`

            this.chatbotContainer.innerHTML = jhtml

            const initBtn = document.getElementById('linto-chatbot-init-btn')
            const closeFrameBtn = document.getElementById('init-frame-btn-close')
            const enableMultiModalBtn = document.getElementById('init-frame-btn-enable-mm')
            const enableMinimalStreamingBtn = document.getElementById('init-frame-btn-enable-ms')

            this.setLintoRightCornerAnimation('sleep')

            // Toggle initialisation frame
            initBtn.onclick = (e) => {
                this.toggleInitFrame()
            }

            // Close initialisation frame
            closeFrameBtn.onclick = (e) => {
                this.toggleInitFrame()
            }

            // Init linto web client
            enableMinimalStreamingBtn.onclick = (e) => {
                this.setChatbotMinimal()
                this.closeInitFrame()
                this.initLintoWeb()
            }

            // Init linto web client
            enableMultiModalBtn.onclick = (e) => {
                this.setChatbotMultiModal()
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
            this.setLintoRightCornerAnimation('destroy')
            initBtn.innerHTML = '<span class="linto-icon"></span>'
        } else {
            initFrame.classList.add('hidden')
            initBtn.innerHTML = ''

            this.setLintoRightCornerAnimation('sleep')
        }
    }
    closeInitFrame() {
        const initBtn = document.getElementById('linto-chatbot-init-btn')
        const initFrame = document.getElementById('linto-chatbot-init-frame')
        initFrame.classList.add('hidden')
        initBtn.innerHTML = ''
    }

    /* LinTO Chatbot MINIMAL STREAMING */
    setChatbotMinimal() {
        this.chatbotMode = 'minimal-streaming'
        let jhtml = `
        <div id="chatbot-minimal" class="${this.chatbotMode} flex row hidden">
            <button id="chatbot-ms-close"></button>
            <div class="chatbot-ms-container flex1 flex row">
                <div id="chatbot-ms-animation" class="chatbot-animation flex col"></div>
                <div class="chatbot-ms-content flex col flex1">
                    <div id="chatbot-ms-content-previous" class="chatbot-ms-content-previous"></div>
                    <div id="chatbot-ms-content-current" class="chatbot-ms-content-current flex col"></div>
                </div>
            </div>
        </div>`

        const chatbotCorner = document.getElementById('linto-chatbot-corner')
        chatbotCorner.innerHTML += `
        
        <button id="chatbot-feedback-btn" class="closed hidden"><span class="icon"></span></button>
        <div id="chatbot-feedback-frame" class="hidden">
            <div class="chatbot-feedback-header flex row">
              <button id="chatbot-feedback-close"></button>
            </div>
          <div id="chatbot-feedback-items"></div>
        </div>`

        this.chatbotContainer.innerHTML += jhtml

        const chatbotUiCloseBtn = document.getElementById('chatbot-ms-close')
        chatbotUiCloseBtn.onclick = (e) => {
            this.stopAll()
            this.hideChatbotMinimal()
        }

        const chatbotLintoBtn = document.getElementById('linto-chatbot-init-btn')
        chatbotLintoBtn.onclick = (e) => {
            this.showChatbotMinimal()
            this.chatbot.startStreaming()
        }

        const feedbackBtn = document.getElementById('chatbot-feedback-btn')
        const feedbackFrame = document.getElementById('chatbot-feedback-frame')
        feedbackBtn.onclick = (e) => {
            if (this.chatbotFeedbackContent.length > 0) {
                if (feedbackFrame.classList.contains('hidden')) {
                    this.showChatbotFeedback()
                } else {
                    this.hideChatbotFeedback()
                }
            }
        }

        const feedbackCloseBtn = document.getElementById('chatbot-feedback-close')
        feedbackCloseBtn.onclick = (e) => {
            feedbackFrame.classList.remove('visible')
            feedbackFrame.classList.add('hidden')
            feedbackBtn.classList.remove('opened')
            feedbackBtn.classList.add('closed')
        }

        const chatbotClose = document.getElementById('chatbot-close')
        chatbotClose.onclick = (e) => {
            this.hideChatbotMinimal()
            this.chatbotContainer.innerHTML = ''
            this.chatbotEnabled = false
            this.chatbot.stopStreaming()
            this.chatbot.stopStreamingPipeline()
            this.chatbot.stopAudioAcquisition()
            this.setLintoRightCornerAnimation('destroy')
            this.chatbot.logout()
            setTimeout(() => {
                this.init()
            }, 1000)
        }
    }
    showChatbotFeedback() {
        const feedbackBtn = document.getElementById('chatbot-feedback-btn')
        const feedbackFrame = document.getElementById('chatbot-feedback-frame')
        if (this.chatbotFeedbackContent.length > 0) {
            if (feedbackFrame.classList.contains('hidden')) {
                feedbackFrame.classList.remove('hidden')
                feedbackFrame.classList.add('visible')
                feedbackBtn.classList.remove('closed')
                feedbackBtn.classList.add('opened')
            }
        }
    }
    hideChatbotFeedback() {
        const feedbackBtn = document.getElementById('chatbot-feedback-btn')
        const feedbackFrame = document.getElementById('chatbot-feedback-frame')
        if (this.chatbotFeedbackContent.length > 0) {
            if (feedbackFrame.classList.contains('visible')) {
                feedbackFrame.classList.remove('visible')
                feedbackFrame.classList.add('hidden')
                feedbackBtn.classList.remove('opened')
                feedbackBtn.classList.add('closed')
            }
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
            this.setLintoLeftCornerAnimation('listening')
        }
    }
    setLintoRightCornerAnimation(name) { // Lottie animations 
        let jsonPath = ''
            // animation
        if (name === 'listening') {
            jsonPath = '/assets/json/microphone.json'
        } else if (name === 'thinking') {
            jsonPath = '/assets/json/linto-think.json'
        } else if (name === 'talking') {
            jsonPath = '/assets/json/linto-talking.json'
        } else if (name === 'sleep') {
            jsonPath = '/assets/json/linto-sleep.json'
        } else if (name === 'awake') {
            jsonPath = '/assets/json/linto-awake.json'
        } else if (name === 'error') {
            jsonPath = '/assets/json/error.json'
        } else if (name === 'validation') {
            jsonPath = '/assets/json/validation.json'
        } else if (name === 'destroy') {
            this.lintoRightCornerAnimation.destroy()
        }
        if (this.lintoRightCornerAnimation !== null && name !== 'destroy') {
            this.lintoRightCornerAnimation.destroy()
        }
        if (name !== 'destroy') {
            this.lintoRightCornerAnimation = lottie.loadAnimation({
                container: document.getElementById('linto-chatbot-init-btn'),
                renderer: 'svg',
                loop: !(name === 'validation' || name === 'error'),
                autoplay: true,
                path: jsonPath,
                rendererSettings: {
                    className: 'linto-animation'
                }
            })
        }
    }
    setLintoLeftCornerAnimation(name) { // Lottie animations 
        let jsonPath = ''
            // animation
        if (name === 'listening') {
            jsonPath = '/assets/json/microphone.json'
        } else if (name === 'thinking') {
            jsonPath = '/assets/json/linto-think.json'
        } else if (name === 'talking') {
            jsonPath = '/assets/json/linto-talking.json'
        } else if (name === 'sleep') {
            jsonPath = '/assets/json/linto-sleep.json'
        } else if (name === 'destroy') {
            this.lintoLeftCornerAnimation.destroy()
        }
        if (this.lintoLeftCornerAnimation !== null && name !== 'destroy') {
            this.lintoLeftCornerAnimation.destroy()
        }
        if (name !== 'destroy') {
            this.lintoLeftCornerAnimation = lottie.loadAnimation({
                container: document.getElementById('chatbot-ms-animation'),
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
        const currentContent = document.getElementById('chatbot-ms-content-current')
        currentContent.innerHTML = value
    }
    updatePrevioustUiContent(value) {
        const currentContent = document.getElementById('chatbot-ms-content-previous')
        currentContent.innerHTML = value
    }

    updateChatbotFeedback(obj) {
        this.chatbotFeedbackContent.push(obj)
        let feedbackBtn = document.getElementById('chatbot-feedback-btn')
        if (feedbackBtn.classList.contains('hidden'))  {
            feedbackBtn.classList.remove('hidden')
        }
        const feedbackContent = document.getElementById('chatbot-feedback-items')
        feedbackContent.innerHTML += `
          <div class="feedback-item ${obj.user} flex row">
            <span class="content">${obj.value}</span>
          </div>
        `
        feedbackContent.scrollTo({
            top: feedbackContent.offsetHeight,
            left: 0,
            behavior: 'smooth'
        })
    }
    updateChatbotFeedbackData(data) {
            let jhtml = '<div class="feedback-item data flex col">'
            for (let item of data) {
                if (item.eventType === 'choice') {
                    jhtml += `<button class="chatbot-event-btn">${item.text}</button>`
                } else if (item.eventType === 'attachment') {
                    if (!!item.file && item.file.type === 'image') {
                        jhtml += `<img src="${item.file.url}" class="chatbot-event-img">`
                    }
                }
            }
            jhtml += '</div>'
            const feedbackContent = document.getElementById('chatbot-feedback-items')
            feedbackContent.innerHTML += jhtml

            let chatbotEventsBtn = document.getElementsByClassName('chatbot-event-btn')
            for (let btn of chatbotEventsBtn) {
                btn.onclick = (e) =>  {

                    let value = e.target.innerHTML
                    this.updateChatbotFeedback({ user: 'user', value })
                    this.chatbot.sendChatbotText(value)
                }
            }

            feedbackContent.scrollTo({
                top: feedbackContent.offsetHeight,
                left: 0,
                behavior: 'smooth'
            })
        }
        /* LinTO Chatbot MULTI-MODAL MODE */
    setChatbotMultiModal() {
        this.chatbotMode = 'multi-modal'

        let jhtml = `
        <div id="chatbot-multi-modal" class="flex col hidden">
            <div class="header flex row">
                <span class="chatbot-mm-title flex1">LinTO Chatbot</span>
                <div class="chatbot-mm-actions">
                    <!-- <button id="chatbot-mm-mic-mute" class="chatbot-mm-actions-btn"><span class="icon mic mute"></span></button> -->
                    <button id="chatbot-mm-collapse" class="chatbot-mm-actions-btn"><span class="icon collapse"></span></button>
                    <button id="chatbot-mm-close" class="chatbot-mm-actions-btn"><span class="icon close"></span></button>
                </div>
            </div>
            <div class="body flex1 flex col" id="chatbot-body">
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
        this.chatbotContainer.innerHTML += jhtml

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

        const closeChatbotBtn = document.getElementById('chatbot-mm-close')
        closeChatbotBtn.onclick = (e) => {
            this.hideChatbotMultiModal()
            this.chatbotContainer.innerHTML = ''
            this.chatbotEnabled = false
            this.chatbot.stopStreaming()
            this.chatbot.stopStreamingPipeline()
            this.chatbot.stopAudioAcquisition()
            this.setLintoRightCornerAnimation('destroy')
            this.chatbot.logout()
            setTimeout(() => {
                this.init()
            }, 1000)
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
    }
    updateMultiModalUser(content) {
        const multiModalContent = document.getElementById('chatbot-mm-content')
        let jhtml = `
        <div class="chatbot-mm-content-item user flex row">
          <span class="content">${content}</span>
        </div>`
        multiModalContent.innerHTML += jhtml
        document.getElementById('chatbot-body').scrollTo({
            top: multiModalContent.offsetHeight,
            left: 0,
            behavior: 'smooth'
        });
    }
    updateMultiModalBot(content) {
        const multiModalContent = document.getElementById('chatbot-mm-content')
        let jhtml = `
      <div class="chatbot-mm-content-item bot flex row">
        <span class="content">${content}</span>
      </div>`
        multiModalContent.innerHTML += jhtml
        document.getElementById('chatbot-body').scrollTo({
            top: multiModalContent.offsetHeight,
            left: 0,
            behavior: 'smooth'
        });
    }
    updateMultiModalData(data) {
        const multiModalContent = document.getElementById('chatbot-mm-content')
        let jhtml = '<div class="chatbot-mm-content-item data flex col">'
        for (let item of data) {
            if (item.eventType === 'choice') {
                jhtml += `<button class="chatbot-event-btn">${item.text}</button>`
            } else if (item.eventType === 'attachment') {
                if (!!item.file && item.file.type === 'image') {
                    jhtml += `<img src="${item.file.url}" class="chatbot-event-img">`
                }
            }
        }
        jhtml += '</div>'
        multiModalContent.innerHTML += jhtml

        let chatbotEventsBtn = document.getElementsByClassName('chatbot-event-btn')
        for (let btn of chatbotEventsBtn) {
            btn.onclick = (e) =>  {
                let value = e.target.innerHTML
                this.updateMultiModalUser(value)
                this.chatbot.sendChatbotText(value)
            }
        }

        document.getElementById('chatbot-body').scrollTo({
            top: multiModalContent.offsetHeight,
            left: 0,
            behavior: 'smooth'
        });
    }
    updateMultiModalInput(content) {
        const multiModalInput = document.getElementById('chatbot-mm-input')
        multiModalInput.innerHTML = content
    }
    closeAll() {
        if (this.chatbotMode === 'minimal-streaming') {
            this.hideChatbotMinimal()
        } else if (this.chatbotMode === 'multi-modal') {
            this.hideChatbotMultiModal()
        }
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
                    this.updateChatbotFeedback({
                        user: 'user',
                        value: event.detail.behavior.streaming.text
                    })
                } else if (this.chatbotMode === 'multi-modal') {
                    this.updateMultiModalUser(event.detail.behavior.streaming.text)
                    this.updateMultiModalInput('')
                    const micBtn = document.getElementById('chatbot-mm-mic')
                    micBtn.classList.remove('streaming')
                }
                this.chatbot.stopStreaming()
                this.setLintoLeftCornerAnimation('thinking')
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
        if (this.streamingMode !== 'vad') {
            this.chatbot.startStreamingPipeline()
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
        if (this.chatbotMode === 'multi-modal') this.hideChatbotMultiModal()
        if (this.chatbotMode === 'minimal-streaming') this.hideChatbotMinimal()

        const streamingBtns = document.getElementsByClassName('linto-chatbot-streaming-btn')
        for (let btn of streamingBtns) {
            if (btn.classList.contains('streaming-on')) {
                btn.classList.remove('streaming-on')
            }
        }

        this.setLintoRightCornerAnimation('error')
        this.lintoRightCornerAnimation.onComplete = () => {
            this.chatbot.startStreamingPipeline()
            setTimeout(() => {
                this.setLintoRightCornerAnimation('awake')
            }, 500)
        }
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
            let data = e.detail.behavior.chatbot.answer.data // chatbot answers (links)

            if (this.chatbotMode === 'minimal-streaming') {
                this.updateCurrentUiContent(answer)
                this.updatePrevioustUiContent(ask)
                this.setLintoLeftCornerAnimation('talking')
                this.updateChatbotFeedback({
                    user: 'bot',
                    value: answer
                })
                this.updateChatbotFeedbackData(data)
            }
            if (this.chatbotMode === 'multi-modal') {
                if (answer.length > 0) {
                    this.updateMultiModalBot(answer)
                }
                this.updateMultiModalData(data)
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
        this.setLintoLeftCornerAnimation('destroy')
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

        // Bind custom events
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

        // set animation
        this.setLintoRightCornerAnimation('validation')
        this.lintoRightCornerAnimation.onComplete = () => {
            setTimeout(() => {
                this.setLintoRightCornerAnimation('awake')
                const chatbotCloseBtn = document.getElementById('chatbot-close')
                chatbotCloseBtn.classList.remove('hidden')
                chatbotCloseBtn.classList.add('visible')
            }, 500)
        }
    }
}