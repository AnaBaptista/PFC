'use strict'

const debug = require('debug')('HOMI::Server')
const fs = require('fs')
const path = require('path')

/**
 * Uncomment this line to use desktop configutation,
 * comment to use web configuration
 */
const config = fs.readFileSync('./config.json', 'utf8')
/**
 * Uncomment this line to use web configutation,
 * comment to use desktop configuration
*/
// const config = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
module.exports = {config: JSON.parse(config)}

const hbs = require('./utils/handlebars-helpers')
const bodyParser = require('body-parser')
const express = require('express')

const fileRouter = require('./routes/file-routes')
const mappingRouter = require('./routes/mapping-routes')
const individualMappingRouter = require('./routes/individual-mapping-routes')
const index = require('./routes/index-routes')
const populateRouter = require('./routes/populate-routes')
const individualRouter = require('./routes/individual-routes')

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
//
// app.set('port', (process.env.PORT || 8000))
// app.listen(app.get('port'), () => {
//   debug(`Listening on port: ${app.get('port')}`)
// })

module.exports = {
  app: app
}
