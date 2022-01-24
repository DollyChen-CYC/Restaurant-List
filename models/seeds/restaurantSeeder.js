const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant_list.json')
const db = require('../../config/mongoose')

const seedRestaurants = restaurantList.results.map(restaurant => {
  return {
    name: restaurant.name,
    name_en: restaurant.name_en,
    category: restaurant.category,
    image: restaurant.image,
    location: restaurant.location,
    phone: restaurant.phone,
    google_map: restaurant.google_map,
    rating: restaurant.rating,
    description: restaurant.description
  }
})

db.once('open', () => {
  Promise.all(
    [
      User.create({
        email: 'root@example.com',
        password: '12345678'
      }),
      Restaurant.insertMany(seedRestaurants)
    ]
  )
    .then(() => console.log('done'))
    .catch(error => console.log(error))
})
