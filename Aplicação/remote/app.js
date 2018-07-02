'use strict'

const isntFork = process.send === undefined
const config = (isntFork && require('./configuration/config')) || require('./configuration/config-electron')
module.exports = {config: config}

const path = require('path')
const hbs = require('./utils/handlebars-helpers')
const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
var debug = require('debug')('HOMI')

const fileRouter = require('./controllers/file-routes')
const mappingRouter = require('./controllers/mapping-routes')
const individualMappingRouter = require('./controllers/individual-mapping-routes')
const index = require('./controllers/index-routes')
const populateRouter = require('./controllers/populate-routes')
const individualRouter = require('./controllers/individual-routes')

const app = express()

let dirname = __dirname
console.log(dirname)
app.set('views', path.join(dirname, 'views'))

app.set('view engine', 'hbs')
app.set('port', (process.env.PORT || 8000))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(dirname, 'public')))

hbs.registerPartials(path.join(dirname, 'views/partials'))

app.use(fileRouter)
app.use(mappingRouter)
app.use(index)
app.use(populateRouter)
app.use(individualRouter)
app.use(individualMappingRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(app.get('port'), () => {
  debug(`Listening on port: ${app.get('port')}`)
  debug(config)
})
