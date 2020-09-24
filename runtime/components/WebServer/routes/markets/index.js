const debug = require('debug')('linto-admin:routes/admin')

module.exports = (webServer) => {
    return [{
            path: '/healthcare',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/healthcare.html')
            }
        },
        {
            path: '/banking',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/banking.html')
            }
        },
        {
            path: '/voice-enabled-web-applications',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/voice-enabled-web-applications.html')
            }
        },
        {
            path: '/meeting-rooms-and-entreprise',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/meeting-rooms-and-entreprise.html')
            }
        }, {
            path: '/smart-building-smart-office',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/smart-building-smart-office.html')
            }
        }, {
            path: '/hands-free-processes',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/hands-free-processes.html')
            }
        }, {
            path: '/hobbyist-hackers-and-ai-enthousiast',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/hobbyist-hackers-and-ai-enthousiast.html')
            }
        }, {
            path: '/user-accessibility',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/user-accessibility.html')
            }
        }, {
            path: '/aeronautics',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'markets/aeronautics.html')
            }
        }
    ]
}