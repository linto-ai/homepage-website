const debug = require('debug')('linto-admin:routes/admin')

module.exports = (webServer) => {
    return [{
            path: '/speech-to-text-engine',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/speech-to-text-engine.html')
            }
        },
        {
            path: '/multiplatform-voice-access-endpoint',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/multiplatform-voice-access-endpoint.html')
            }
        },
        {
            path: '/conversational-ai-and-chatbots',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/conversational-ai-and-chatbots.html')
            }
        },
        {
            path: '/customizable-wake-word-detection',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/customizable-wake-word-detection.html')
            }
        }, {
            path: '/productivity-and-skills-development-toolkit',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/productivity-and-skills-development-toolkit.html')
            }
        }, {
            path: '/linto-voice-assistant',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/linto-voice-assistant.html')
            }
        }, {
            path: '/fleet-management',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'products/fleet-management.html')
            }
        }
    ]
}