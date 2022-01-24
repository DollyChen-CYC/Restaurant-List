const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurant')

router.get('/', (req, res) => {
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const searchResults = []
  let showErrorMsg = false
  const sort = req.query.sort
  const sortDocBy = {
    asc: { name: 1 },
    desc: { name: -1 },
    category: { category: 1 },
    location: { location: 1 }
  }

  // sort
  if (!keyword) {
    RestaurantList.find()
      .lean()
      .sort(sortDocBy[sort])
      .then(sortResults => {
        return res.render('index', { restaurants: sortResults, sort })
      })
      .catch(err => console.log(err))


  } else {
    // compare search keywords
    // TODO: Refactor search feature.  Create fuzzy searching with mongoose.
    const restaurantList = require('../../restaurant_list.json')
    const keywordArr = keyword.trim().toLowerCase().split(' ')

    for (restaurant of restaurantList.results) {
      const { name, name_en, category, location } = restaurant
      const infoArr = [name, name_en, category, location]
      for (word of keywordArr) {
        if (infoArr.some(info => info.toLowerCase().includes(word)) && !searchResults.includes(restaurant)) {
          searchResults.push(restaurant)
        }
      }
    }
    if (searchResults.length === 0) {
      showErrorMsg = true
    }
    res.render('index', { restaurants: searchResults, keyword, showErrorMsg, sort })
  }
})

module.exports = router