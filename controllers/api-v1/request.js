const router = require('express').Router()
const dotenv = require('dotenv')
dotenv.config()
const {OAuth2Client} = require('google-auth-library')

// Google oauth 
router.post('/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Referrer-Policy', 'no-referrer-when-downgrade')

    const redirectUrl = 'http://127.0.0.1:3000/oauth'

    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    )

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        // for testing, will force refresh token to be created and always sent. In production, only use if refresh token is needed to be created
        access_type:'offline', 
        scope:'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    })

    res.json({url:authorizeUrl})
})