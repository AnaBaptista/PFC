'use strict'
const port = 3000
const hbs = require('hbs')
const path = require('path')
const express = require('express')

const index = require('./routes/index');

const app = express()

app.use(express.static(path.join(__dirname,'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')


app.use(index)

app.listen(port)
