'use strict'

process.env['DEBUG'] = 'HOMI::Server'
const debug = require('debug')('HOMI::Server')
/**
 * Verify if it's running from electron
 */
const isntFork = process.send === undefined
const config = (isntFork && require('./config/config')) || require('./config/config-electron')
debug(config)
module.exports = {config: config}

const path = require('path')
const hbs = require('./utils/handlebars-helpers')
const bodyParser = require('body-parser')
const express = require('express')

const fileRouter = require('./controllers/file-routes')
const mappingRouter = require('./controllers/mapping-routes')
const individualMappingRouter = require('./controllers/individual-mapping-routes')
const index = require('./controllers/index-routes')
const populateRouter = require('./controllers/populate-routes')
const individualRouter = require('./controllers/individual-routes')

const app = express()

/**
 * Configuration
 */
app.set('views', path.join(__dirname, `views`))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, 'views/partials'))

/**
 * Middlewares and routes
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(fileRouter)
app.use(mappingRouter)
app.use(index)
app.use(populateRouter)
app.use(individualRouter)
app.use(individualMappingRouter)

/**
 * Errors
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  debug(`${req.method} ${req.url} - ${err.status} ${err.message}`)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

/**
 * Listen on port
 */
// app.set('port', (process.env.PORT || 8000))
// app.listen(app.get('port'), () => {
//   debug(`Listening on port: ${app.get('port')}`)
// })

module.exports = {
    app: app
}
