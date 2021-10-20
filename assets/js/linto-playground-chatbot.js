window.onload = async function() {
    window.chatbot = new ChatBot({
        debug: true,
        containerId: 'chatbot-wrapper',
        lintoWebToken: 'g1UZQSKNq07VJzMz', 
        //prod : g1UZQSKNq07VJzMz
        //local : p0UGj0NM0TePH5am
        lintoWebHost: 'https://stage.linto.ai/overwatch/local/web/login',
        lintoCustomEvents: [{
            flag: 'custom_action_from_skill',
            func: (event) => { customActionSkill(event) }
        }, {
            flag: 'streaming_stop',
            func: () => { onStreamingStop() }
        }]


        //chatbotMode: 'minimal-streaming'
    })

    let customActionSkill = async (event) => {
        console.log(event, event.detail.behavior.customAction.kind)
        if (!!event.detail && event.detail.behavior.customAction.kind === 'read_title') {
            let activeTitles = $('.playground-webpage-content-block.active h3')
            if (activeTitles.length > 0) {
                const title = activeTitles[0].innerHTML
                if(window.chatbot.chatbotMode === 'multi-modal') {
                    window.chatbot.updateMultiModalBot(title)
                } else if(window.chatbot.chatbotMode === 'minimal-streaming') {
                    const current = document.getElementById('chatbot-content-current').innerHTML
                    window.chatbot.updatePrevioustUiContent(current)
                    window.chatbot.updateCurrentUiContent(title)
                }
                let say = await window.chatbot.say(title)
                if(!!say) {
                    this.chatbot.closeAll()
                }
            }
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'read_content') {
            let activeContent = $('.playground-webpage-content-block.active p')
            if (activeContent.length > 0) {
                const content = activeContent[0].innerHTML
                if(window.chatbot.chatbotMode === 'multi-modal') {
                    window.chatbot.updateMultiModalBot(content)
                } else if(window.chatbot.chatbotMode === 'minimal-streaming') {
                    const current = document.getElementById('chatbot-content-current').innerHTML
                    window.chatbot.updatePrevioustUiContent(current)
                    window.chatbot.updateCurrentUiContent(content)
                }
                let say = await window.chatbot.say(content)
                if(!!say) {
                    this.chatbot.closeAll()
                }
            }
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'block_next') {
            let nbBlocks = $('.playground-webpage-content-block').length
            const activeBlock = $('.playground-webpage-content-block.active')
            const activeBlockIndex = parseInt(activeBlock.attr('data-index'))
            let targetBlockIndex = activeBlockIndex + 1 > nbBlocks ? 1 : activeBlockIndex + 1

            const targetBlock = $('.playground-webpage-content-block[data-index="' + targetBlockIndex +
                '"]')
            activeBlock.removeClass('active')
            targetBlock.addClass('active')
            this.chatbot.closeAll()

        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'block_previous') {
            let nbBlocks = $('.playground-webpage-content-block').length
            const activeBlock = $('.playground-webpage-content-block.active')
            const activeBlockIndex = parseInt(activeBlock.attr('data-index'))
            let targetBlockIndex = activeBlockIndex - 1 < 1 ? nbBlocks : activeBlockIndex - 1

            const targetBlock = $('.playground-webpage-content-block[data-index="' + targetBlockIndex +
                '"]')
            activeBlock.removeClass('active')
            targetBlock.addClass('active')
            this.chatbot.closeAll()

        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'slide_next') {
            $('#playground-slider').slick('slickNext')
            this.chatbot.closeAll()

        }
        // Slide previous
        if (!!event.detail && event.detail.behavior.customAction.kind === 'slide_previous') {
            $('#playground-slider').slick('slickPrev')
            this.chatbot.closeAll()

        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'accesibility_on') {
            enableAccessibility()
            this.chatbot.closeAll()

        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'accesibility_off') {
            disableAccessibility()
            this.chatbot.closeAll()

        }
    }

    let onStreamingStop = () => {
        const recordBtns = $('.linto-chatbot-streaming-btn')
        for (let btn of recordBtns) {
            if (btn.classList.contains('streaming-on')) {
                btn.classList.remove('streaming-on')
                let inputTarget = btn.getAttribute('data-target')
                let parent = btn.parentElement
                let btnPlay = parent.children[1]
                if ($('#' + inputTarget)[0].innerHTML.length > 0) {
                    btnPlay.classList.remove('hidden')
                }
                btnPlay.onclick = () => {
                    window.chatbot.say($('#' + inputTarget)[0].innerHTML)
                }
            }
        }
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

    /* SLIDER */
    $('#playground-slider').slick({
        dots: true,
        arrows: true,
        autoplay: false
    })



    /*$('#record-name')[0].onclick = (e) => {
        $('#record-name')[0].classList.add('streaming-on')
        window.chatbot.customStreaming('vad-custom', 'form-input-name')
    }*/
    $('.linto-chatbot-streaming-btn').click(function() {
        if (window.chatbot.chatbotEnabled) {
            $(this).addClass('streaming-on')
            const target = $(this).attr('data-target')
            const streamMode = $(this).attr('data-type')
            window.chatbot.customStreaming(streamMode, target)
        }
    })
}