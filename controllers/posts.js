const Post = require("../models/Post")
const User = require("../models/Users")

// Create
const create = async (req, res) => {
    const newPost = new Post(req.body)

    try {
        await newPost.save()

        res.status(200).json({
            message: `The post ${newPost._id} has been published`,
            status_code: 200,
            error: false,
            messageError: ''
        })
    } catch (err) {
        res.status(500).json({
            message: '',
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}
// Get timeline posts
const getAll = async (req, res) => {
    const { userId } = req.body

    try {
        const currentUser = await User.findById(userId)
        const userPosts = await Post.find({ userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )

        res.status(200).json({
            message: 'Timeline posts has been loaded',
            status_code: 200,
            data: userPosts.concat(...friendPosts),
            error: false,
            messageError: ''
        })
    } catch (err) {
        res.status(500).json({
            message: '',
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}
// Get a post
const getPost = async (req, res) => {
    const { id } = req.params

    try {
        const post = await Post.findById(id)

        res.status(200).json({
            message: `The data of post ${post._id} has been loaded`,
            status_code: 200,
            data: post,
            error: false,
            messageError: ''
        })
    } catch (err) {
        res.status(500).json({
            message: '',
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}
// Update
const update = async (req, res) => {
    const { userId } = req.body
    const { id } = req.params
    try {
        const postToUpdate = await Post.findById(id)

        if(postToUpdate.userId === userId) {
            await postToUpdate.updateOne({ $set: req.body })

            res.status(200).json({
                message: `The post ${postToUpdate._id} has been updated`,
                status_code: 200,
                error: false,
                messageError: ''
            })
        } else {
            res.status(403).json({
                message: '',
                status_code: 403,
                error: true,
                messageError: 'You can update only your post'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: '',
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}
// Delete
const remove = async (req, res) => {
    const { userId } = req.body
    const { id } = req.params
    try {
        const postToDelete = await Post.findById(id)

        if(postToDelete.userId === userId) {
            await postToDelete.deleteOne()

            res.status(200).json({
                message: `The post ${postToDelete._id} has been deleted`,
                status_code: 200,
                error: false,
                messageError: ''
            })
        } else {
            res.status(403).json({
                message: '',
                status_code: 403,
                error: true,
                messageError: 'You can delete only your post'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: '',
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}
// Like / Dislike
const likePost = async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    try {
        const postToLike = await Post.findById(id)

        if(!postToLike.likes.includes(userId)) {
            await postToLike.updateOne({ $push: { likes: userId } })

            res.status(200).json({
                message: `The post ${postToLike._id} has been liked`,
                status_code: 200,
                error: false,
                messageError: ''
            })
        } else {
            await postToLike.updateOne({ $pull: { likes: userId } })

            res.status(200).json({
                message: `The post ${postToLike._id} has been disliked`,
                status_code: 200,
                error: false,
                messageError: ''
            })
        }
    } catch (err) {
        res.status(500).json({
            message: '',
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}

module.exports = {
    create,
    getAll,
    getPost,
    update,
    remove,
    likePost
}