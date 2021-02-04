const debug = require('debug')('app:config')
const dotenv = require('dotenv')
const fs = require('fs')

function ifHasNotThrow(element, error) {
    if (!element) throw error
    return element
}

function ifHas(element, defaultValue) {
    if (!element) return defaultValue
    return element
}

function configureDefaults() {
    try {
        dotenv.config() // loads process.env from .env file (if not specified by the system)
        const envdefault = dotenv.parse(fs.readFileSync('.envdefault')) // default usable values
        process.env.ALLOWED_ORIGINS = ifHas(process.env.ALLOWED_ORIGINS, envdefault.ALLOWED_ORIGINS)
        process.env.COMPONENTS = ifHas(process.env.COMPONENTS, envdefault.COMPONENTS)
        process.env.WEBSERVER_HTTP_PORT = ifHas(process.env.WEBSERVER_HTTP_PORT, envdefault.WEBSERVER_HTTP_PORT)
        process.env.BASE_PATH = ifHas(process.env.BASE_PATH, envdefault.BASE_PATH)
            // Mailer
        process.env.SMTP_HOST = ifHas(process.env.SMTP_HOST, envdefault.SMTP_HOST)
        process.env.SMTP_PORT = ifHas(process.env.SMTP_PORT, envdefault.SMTP_PORT)
        process.env.SMTP_SECURE = ifHas(process.env.SMTP_SECURE, envdefault.SMTP_SECURE)
        process.env.SMTP_REQUIRE_TLS = ifHas(process.env.SMTP_REQUIRE_TLS, envdefault.SMTP_REQUIRE_TLS)
        process.env.SMTP_AUTH = ifHas(process.env.SMTP_AUTH, envdefault.SMTP_AUTH)
        process.env.SMTP_PSWD = ifHas(process.env.SMTP_PSWD, envdefault.SMTP_PSWD)
        process.env.CONTACT_EMAIL = ifHas(process.env.CONTACT_EMAIL, envdefault.CONTACT_EMAIL)
        process.env.NO_REPLY_EMAIL = ifHas(process.env.NO_REPLY_EMAIL, envdefault.NO_REPLY_EMAIL)
    } catch (e) {
        console.error(debug.namespace, e)
        process.exit(1)
    }
}
module.exports = configureDefaults()