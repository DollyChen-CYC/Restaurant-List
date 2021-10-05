// required package used in this project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant_list.json')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results})
})

app.get('/restaurants/:id', (req, res) => {
  const selectedRestaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', {restaurant: selectedRestaurant})
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