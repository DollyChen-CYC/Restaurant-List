// required package used in this project
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list')
const app = express()
const routes = require('./routes')
const port = 3000
const db = mongoose.connection

// connect to mongoDB
db.on('error', () => {
  console.log('mongoDB error!')
})
db.once('open', () => {
  console.log('mongoDB connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// use method-override
app.use(methodOverride('_method'))

// routes setting
app.use(routes)

// start and listen on the Express server
app.listen(port, () => console.log(`Express is listening on localhost:${port}`))