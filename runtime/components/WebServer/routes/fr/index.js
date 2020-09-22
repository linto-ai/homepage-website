const debug = require('debug')('linto-admin:routes/admin')

module.exports = (webServer) => {
    return [{
            path: '/',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'fr/index.html')
            }
        },
        {
            path: '/enterprises',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'fr/enterprises.html')
            }
        }
    ]
}