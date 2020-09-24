const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./homepage')(webServer),
        "/setup": require('./setup')(webServer),
        "/fr": require('./fr')(webServer),
        "/mail": require('./contact')(webServer)
    }
}