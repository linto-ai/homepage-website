const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/mail": require('./contact')(webServer)
    }
}