module.exports = (webServer) => {
    return [{
        path: '/webpage',
        method: 'get',
        requireAuth: true,
        controller: (req, res, next) => {
            res.setHeader("Content-Type", "text/html")
            res.sendFile(process.env.BASE_PATH + 'playground/webpage.html')
        }
    }]
}