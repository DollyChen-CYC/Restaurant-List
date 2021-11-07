// required package used in this project
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list')
const app = express()
const port = 3000
const db = mongoose.connection
const RestaurantList = require('./models/restaurant')

// connect to mongoDB
db.on('error', () => {
  console.log('mongoDB error!')
})
db.once('open', () => {
  console.log('mongoDB connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// routes setting
app.get('/', (req, res) => {
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/detail', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('show', {restaurant}))
  // const selectedRestaurant = restaurantList.results.find(restaurant => restaurant._id.toString() === req.params.id)
  // res.render('show', {restaurant: selectedRestaurant})
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const keywordArr = keyword.trim().toLowerCase().split(' ')
  const searchResults = []
  let showErrorMsg = false

  // compare search keywords
  for (restaurant of restaurantList.results) {
    const {name, name_en, category, location} = restaurant  // 解構賦值
    const infoArr = [name, name_en, category, location]
    
    for (word of keywordArr) {
      if (infoArr.some(info => info.toLowerCase().includes(word)) && !searchResults.includes(restaurant)) {
        searchResults.push(restaurant)
      }
    }
  }
  // notify result not found
  if (searchResults.length === 0) {
    showErrorMsg = true
  } 
  // render page
  res.render('index', {restaurants: searchResults, keyword, showErrorMsg})
})

// start and listen on the Express server
app.listen(port, () => console.log(`Express is listening on localhost:${port}`))