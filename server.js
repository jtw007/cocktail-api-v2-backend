require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

//config express app
const app = express()
const PORT = process.env.PORT || 8000

const API_KEY = process.env.API_KEY
console.log(`API_KEY${API_KEY}`)

app.use(express.json())
//cross origin resource sharing
app.use(cors())

// GET 
app.get('/', async(req,res) => {
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
