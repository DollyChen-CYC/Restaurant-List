// required package used in this project
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const usePassport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()
const routes = require('./routes')
const port = 3000

// connect to mongoDB
require('./config/mongoose')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.use(session({
  secret: 'restaurantSecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// use method-override
app.use(methodOverride('_method'))

// routes setting
app.use(routes)

// start and listen on the Express server
app.listen(port, () => console.log(`Express is listening on localhost:${port}`))