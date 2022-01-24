const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurant')

router.get('/:id/detail', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
})

router.put('/:id', (req, res) => {
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

router.get('/search', (req, res) => {
  // TODO: Refactor search feature.  Use fuzzy searching with mongoose.
  const restaurantList = require('../../restaurant_list.json')
  const keyword = req.query.keyword
  const keywordArr = keyword.trim().toLowerCase().split(' ')
  const searchResults = []
  let showErrorMsg = false

  // compare search keywords
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
  // render page
  res.render('index', { restaurants: searchResults, keyword, showErrorMsg })
})

module.exports = router