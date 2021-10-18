window.onload = async function() {
    window.chatbot =  new ChatBot({
        debug: true,
        containerId: 'chatbot-wrapper',
        lintoWebToken: 'p0UGj0NM0TePH5am', //qTw7il98QXAFaxRr
        lintoWebHost: 'https://stage.linto.ai/overwatch/local/web/login',
        chatbotMode: 'multi-modal',
        lintoCustomEvents: [
            {
                flag: 'custom_action_from_skill',
                func: (event) => {
                    customActionSkill(event)
                }
            }
        ]
            
        
        //chatbotMode: 'minimal-streaming'
    })

    let customActionSkill = (event) => {
        console.log(event, event.detail.behavior.customAction.kind)
        if(!!event.detail && event.detail.behavior.customAction.kind === 'read_title') {
            let activeTitles = $('.playground-webpage-content-block.active h3')
            if(activeTitles.length > 0) {
                const title = activeTitles[0].innerHTML
                window.chatbot.updateMultiModalBot(title)
                window.chatbot.say(title)
            }
        }
        if(!!event.detail && event.detail.behavior.customAction.kind === 'read_content') {
            let activeContent = $('.playground-webpage-content-block.active p')
            if(activeContent.length > 0) {
                const content = activeContent[0].innerHTML
                window.chatbot.updateMultiModalBot(content)
                window.chatbot.say(content)
            }
        }
        if(!!event.detail && event.detail.behavior.customAction.kind === 'block_next') {
            let nbBlocks = $('.playground-webpage-content-block').length
            const activeBlock = $('.playground-webpage-content-block.active')
            const activeBlockIndex = parseInt(activeBlock.attr('data-index'))
            let targetBlockIndex = activeBlockIndex + 1 > nbBlocks ? 1 : activeBlockIndex + 1

            const targetBlock = $('.playground-webpage-content-block[data-index="'+ targetBlockIndex
             +'"]')
            
             activeBlock.removeClass('active')
             targetBlock.addClass('active')
             
        }
            
    }
}