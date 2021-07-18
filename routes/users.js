const router = require('express').Router()

const controller = require('../controllers/user')

router.get('/', (req,res) => {
    res.status(200).json({
        message: `Users route it's working`
    })
})

// Get a User
router.get('/:id', controller.getUser)
// Update
router.put('/:id', controller.update)
// Delete
router.delete('/:id', controller.remove)
// Follow
router.put('/:id/follow', controller.follow)
// Unfollow
router.put('/:id/unfollow', controller.unfollow)

module.exports = router