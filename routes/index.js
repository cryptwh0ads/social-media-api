const router = require('express').Router()

const authRoute = require('./auth')
const userRoute = require('./users')
const postsRoute = require('./posts')

// API route
router.get('/', (req, res) => {
    res.status(200).json({
        message: `API it's working!`
    })
})

// Auth route
router.use('/auth', authRoute)
// User route
router.use("/users", userRoute)
// Posts route
router.use("/posts", postsRoute)

module.exports = router
