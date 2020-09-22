const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./homepage')(webServer),
        "/enterprises": require('./enterprises')(webServer),
        "/fr": require('./fr')(webServer),
        "/mail": require('./contact')(webServer)
    }
}