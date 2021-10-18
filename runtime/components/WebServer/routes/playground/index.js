module.exports = (webServer) => {
    return [{
            path: '/webpage',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'playground/webpage.html')
            }
        },
        {
            path: '/webpage/en',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'playground/webpage-en.html')
            }
        },
        {
            path: '/chatbot',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'playground/chatbot.html')
            }
        },
        {
            path: '/meeting-room',
            method: 'get',
            requireAuth: true,
            controller: (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.env.BASE_PATH + 'playground/meeting-room.html')
            }
        }
    ]
}