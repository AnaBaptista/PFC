'use strict'

const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const fileRouter = require('./controllers/file-routes')
const mappingRouter = require('./controllers/individual-mapping-routes')
const index = require('./controllers/index-routes')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

hbs.registerPartials(`${__dirname}/views/partials`)

app.use(fileRouter)
app.use(mappingRouter)
app.use(index)

app.listen(app.get('port'), () => {
  console.log(`listening on port: ${app.get('port')}`)
})
