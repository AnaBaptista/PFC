'use strict'
const port = 3000
const hbs = require('hbs')
const path = require('path')
const express = require('express')

const index = require('./routes/index');

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')


app.use(index)

app.listen(port, () => console.log(`Server listening on: ${port} port`))
