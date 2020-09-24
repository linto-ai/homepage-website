const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./homepage')(webServer),
        "/setup": require('./setup')(webServer),
        "/products": require('./products')(webServer),
        "/markets": require('./markets')(webServer),
        "/fr": require('./fr')(webServer),
        "/mail": require('./contact')(webServer)
    }
}