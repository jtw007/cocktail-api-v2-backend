const router = require('express').Router()
const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

// GET /users - test endpoint
router.get('/', (req, res) => {
    res.json({ msg: 'welcome to the users endpoint' })
})

// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
    try {
        //check if user exists already

        //don't allow emails to register twice

        //hash password
        const password = req.body.password

        //create new user
        const newUser = await db.user.create({
            
        })

        //create jwt payload
        const payload = {
            name: newUser.name,
        }

        //sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET)

        res.json({ token })
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: 'server error' })
    }
})