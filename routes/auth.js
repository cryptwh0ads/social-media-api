const router = require('express').Router()

const controller = require('../controllers/auth')

router.get('/', (req,res) => {
    res.status(200).json({
        message: `Auth route it's working`
    })
})

router.post('/register', controller.register)
router.post('/login', controller.login)

module.exports = router