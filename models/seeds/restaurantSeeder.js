const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant_list.json')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

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

const seedAdmin = {
  email: 'root@example.com',
  password: '12345678'
}

db.once('open', () => {
  Promise.all([
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedAdmin.password, salt))
      .then(hash => {
        seedAdmin.password = hash
        return User.create(seedAdmin)
      }),
    Restaurant.insertMany(seedRestaurants)
  ])
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(error => console.log(error))
})
