//require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

//config express app
const app = express()
const PORT = process.env.PORT || 8000
// request body parsing
app.use(express.json())
//cross origin resource sharing
app.use(cors())

const API_KEY = process.env.API_KEY

const middleWare = (req, res, next) => {
    console.log('im a middleware 😬!')
    res.locals.myData = '👾'
    next()
}
  
// GET / -- test index route
app.get('/', middleWare, (req, res) => {
    console.log(res.locals)
    res.json({ msg: 'hello backend 🤖' })
})

//controllers
app.use('/api-v1/users', require('./controllers/api-v1/users'))
app.use('/api-v1/favorites', require('./controllers/api-v1/favorites'))
    // Google oauth
// app.use('/api-v1/oauth', require('./controllers/api-v1/oauth'))
// app.use('/api-v1/request', require('./controllers/api-v1/request'))


// GET 
app.get('/', async(req,res,) => {
    try {
        const name = req.query.search
        const url = `https://api.api-ninjas.com/v1/cocktail?name=${name}`
        const config = { headers: { 'X-Api-Key': API_KEY}} 
        const response = await axios.get(url,config)
        res.json(response.data)
    } catch(error){
        console.warn(error)
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

// app listen
app.listen(PORT, () => {
    console.log(`You are listening in on port ${PORT}`)
})
