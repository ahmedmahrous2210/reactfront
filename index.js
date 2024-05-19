/* Modules imported */
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const jwt = require('./config/jwt')
const errorHandler = require('./config/jwt-error-handler')
const fileUpload = require('express-fileupload')
const env = process.env.NODE_ENV || 'development'
require('./config/conn')

/* Variables & constants declared */
var app = express()
const server = require('http').Server(app)
const https = require('https')
var privateKey = fs.readFileSync('/etc/letsencrypt/private.key', 'utf8');
//var privateKey ='';
//var certificate = fs.readFileSync('/etc/ssl/certs/ssl-cert-snakeoil.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/certificate.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate }
const httpsServer = https.createServer(credentials, app)

/* Middlewares added */
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(cors())
app.use(fileUpload())
app.use(logger('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(jwt())

/* Routes added */
app.use('/uploads', express.static('uploads'))
app.use('/users', require('./admin/routes/user'))
app.use('/courses', require('./admin/routes/course'))
app.use('/auth', require('./admin/routes/auth'))
app.use('/role', require('./admin/routes/role'))
app.use('/rule', require('./admin/routes/rule'))
app.use('/exam', require('./admin/routes/exam'))
app.use('/schedule', require('./admin/routes/examSchedule'))
app.use('/availibility', require('./admin/routes/availibility'))
app.use('/', require('./admin/routes/ai'))
app.use(errorHandler)

const node_media_server = require('./config/node_media_server');
node_media_server.run();
// and call run() method at the end
// file where we start our web server
app.get('/live', function (req, res) {
  res.send(node_media_server.run())
});



/* Server started */
if (env === 'development') {
  server.listen('5000', function () {
    const serverName = env || 'development'
    console.log(serverName, 'Server running on localhost:5000')
  })
} else {
  httpsServer.listen('5050', function () {
    const serverName = env || 'production'
    console.log(serverName, 'Server running on localhost:5050')
  })
}
