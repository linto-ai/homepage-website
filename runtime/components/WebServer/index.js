const Component = require(`../component.js`)
const path = require("path")
const debug = require('debug')(`app:webserver`)
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const serveIndex = require('serve-index')
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
const cors = require('cors')
var corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

class WebServer extends Component {
    constructor(app) {
        super(app)
        this.id = this.constructor.name
        this.express = app
        this.express = express()
        this.express.set('etag', false)
        this.express.set('trust proxy', true)
        this.express.use(bodyParser.json())
        this.express.use(bodyParser.urlencoded({
            extended: false
        }))
        this.express.use(cookieParser())
        this.httpServer = this.express.listen(process.env.WEBSERVER_HTTP_PORT, "0.0.0.0", (err) => {
            debug(` WebServer listening on : ${process.env.WEBSERVER_HTTP_PORT}`)
            if (err) throw (err)
        })
        this.express.use(cors(corsOptions))
        // Routes
        this.express.use('/downloads', express.static(process.env.PUBLIC_DOWNLOAD_FOLDER), serveIndex(process.env.PUBLIC_DOWNLOAD_FOLDER, { 'icons': true }))
        require('./routes/router.js')(this) // Loads all defined routes
        this.express.use((req, res, next) => {
            res.status(404)
            res.end()
        })

        this.express.use((err, req, res, next) => {
            res.status(500)
            res.end(err.message)
        })

        return this.init()
    }
}

module.exports = app => new WebServer(app)