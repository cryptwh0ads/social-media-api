const router = require('express').Router()

const controller = require('../controllers/posts')

router.get('/', (req,res) => {
    res.status(200).json({
        message: `Posts route it's working`
    })
})

// Timeline
router.get('/timeline/all', controller.getAll)
//Get a Post
router.get('/:id', controller.getPost)
// Create
router.post('/', controller.create)
// Update
router.put('/:id', controller.update)
// Like / Dislike
router.put('/:id/like', controller.likePost)
// Delete
router.delete('/:id', controller.remove)

module.exports = router