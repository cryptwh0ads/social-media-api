const router = require('express').Router()

const userRoute = require('./users')
const authRoute = require('./auth')

// API route
router.get('/', (req, res) => {
    res.status(200).json({
        message: `API it's working!`
    })
})

// User route
router.use("/users", userRoute)
// Auth route
router.use('/auth', authRoute)
module.exports = router