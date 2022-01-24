// required package used in this project
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
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
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// use method-override
app.use(methodOverride('_method'))

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
    .then(restaurant => res.render('show', { restaurant }))
  // const selectedRestaurant = restaurantList.results.find(restaurant => restaurant._id.toString() === req.params.id)
  // res.render('show', {restaurant: selectedRestaurant})
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const keywordArr = keyword.trim().toLowerCase().split(' ')
  const searchResults = []
  let showErrorMsg = false

  // compare search keywords
  for (restaurant of restaurantList.results) {
    const { name, name_en, category, location } = restaurant  // 解構賦值
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
  res.render('index', { restaurants: searchResults, keyword, showErrorMsg })
})

app.put('/restaurants/:id', (req, res) => {
  const _id = req.params.id
  const { name, name_en, category, image, location, phone, description } = req.body
  RestaurantList.findById(_id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}/detail`))
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => console.log(`Express is listening on localhost:${port}`))