const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

//POST user/faves - CREATE receive the name of the cocktail and add it to database
router.post('/', authLockedRoute, async (req, res) => {
    try {
        await db.favorite.findOrCreate({
            where: {
                name: req.body.name,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions, 
                userId: res.locals.user.id
            }
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
})

//GET user/faves - READ return a page with favorited cocktails
router.get('/', async(req, res) => {
    try {
        //READ function to find all favorited cocktails
        const favedCocktails = await db.favorite.findAll()
        res.json(favedCocktails)
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
})

//DELETE user/faves - removes a favorite from the favorites list 
router.delete('/:id', async (req,res) => {
    // console.log(`This is the req.params.id: ${req.params.id}`)
    try{
        //remove the cocktail recipe indicated by the req.params from array
        const deleteFave = await db.favorite.destroy({
            where: {
                id: req.params.id
            },
        }) 
    } catch(error) {
        console.log(error.message)
        res.status(500).send('Server error 🥲')
    }
})

module.exports = router