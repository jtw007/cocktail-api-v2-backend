const router = require('express').Router()
const db = require('../../models')
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
        const findUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        console.log(findUser)
        //don't allow emails to register twice
        if(findUser) return res.status(400).json({ msg: 'User already exists' })

        //hash password
        const password = req.body.password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        //create new user
        const newUser = await db.user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        //create jwt payload
        const payload = {
            name: req.body.name,
            email: newUser.email,
            id: newUser.id
        }

        //sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET)

        res.json({ token })
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req,res) => {
    try {
        //try to find user in the database
        const foundUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })

        const noLoginMessage = 'Incorrect username or password'

        //if the user is not found in the db, return and send a status of 400 with message
        if(!foundUser) return res.status(400).json({ msg: noLoginMessage, body: req.body })

        //check the password from the req body against the password in the database
        const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)

        //if provided passwords does not match, return and send a status of 400 with a message
        if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage, body: req.body })

        //create jwt payload
        const payload = {
            name: foundUser.name,
            email: foundUser.email,
            id: foundUser.id
        }

        //sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET)
        console.log(`Token ${token}`)

        res.json({ token })

    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error '})
    }
})

//GET /auth-locked - will redirect if bad jwt token is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
    res.json( { msg: 'Welcome to the private route!' })
})

module.exports = router