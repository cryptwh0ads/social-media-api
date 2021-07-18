const User = require('../models/Users')
const bcrypt = require('bcrypt')

// Get a User
const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        const {password, updatedAt, ...other} = user._doc

        res.status(200).json({
            message: `Data of user ${user.username} has been loaded`,
            data: other,
            status_code: 200,
            error: false,
            messageError: ''
        })
    }catch (err){
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
    const { userId, password } = req.body
    const { id } = req.params

    if(userId === id || req.body.isAdmin) {
        if(password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                res.status(500).json({
                    message: '',
                    status_code: 500,
                    error: true,
                    messageError: err
                })
            }
        }

        try {
            await User.findByIdAndUpdate(id, {
                $set: req.body
            })

            res.status(200).json({
                message: 'Your account has been updated',
                status_code: 200,
                error: false,
                messageError: ''
            })
        } catch (err) {
            return res.status(500).json({
                message: '',
                status_code: 500,
                error: true,
                messageError: err
            })
        }
    } else {
        return res.status(403).json({
            message: '',
            status_code: 403,
            error: true,
            messageError: 'You can update only your account!'
        })
    }
}
// Delete
const remove = async (req, res) => {
    const { userId, password } = req.body
    const { id } = req.params

    if(userId === id || req.body.isAdmin) {

        try {
            await User.findByIdAndDelete(id)

            res.status(200).json({
                message: 'Your account has been deleted',
                status_code: 200,
                error: false,
                messageError: ''
            })
        } catch (err) {
            return res.status(500).json({
                message: '',
                status_code: 500,
                error: true,
                messageError: err
            })
        }
    } else {
        return res.status(403).json({
            message: '',
            status_code: 403,
            error: true,
            messageError: 'You can delete only your account!'
        })
    }
}
// Follow
const follow = async (req, res) => {
    const { userId } = req.body
    const { id } = req.params

    if(userId !== id) {
        try {
            const userToFollow = await User.findById(id)
            const currentUser = await User.findById(userId)

            if(!userToFollow.followers.includes(userId)) {
                await userToFollow.updateOne({ $push: { followers: userId}})
                await currentUser.updateOne({ $push: { following: id}})

                res.status(200).json({
                    message: `User ${userToFollow.username} has been followed.`,
                    status_code: 200,
                    error: false,
                    messageError: ''
                })
            } else {
                res.status(403).json({
                    message: '',
                    status_code: 403,
                    error: true,
                    messageError: 'You already following this user'
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: '',
                status_code: 500,
                error: true,
                messageError: err
            })
        }
    } else {
        res.status(403).json({
            message: '',
            status_code: 403,
            error: true,
            messageError: `You can't follow yourself`
        })
    }
}
// Unfollow
const unfollow = async (req, res) => {
    const { userId } = req.body
    const { id } = req.params

    if(userId !== id) {
        try {
            const userToUnfollow = await User.findById(id)
            const currentUser = await User.findById(userId)

            if(userToUnfollow.followers.includes(userId)) {
                await userToUnfollow.updateOne({ $pull: { followers: userId}})
                await currentUser.updateOne({ $pull: { following: id}})

                res.status(200).json({
                    message: `User ${userToUnfollow.username} has been unfollowed.`,
                    status_code: 200,
                    error: false,
                    messageError: ''
                })
            } else {
                res.status(403).json({
                    message: '',
                    status_code: 403,
                    error: true,
                    messageError: `You don't follow this user`
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: '',
                status_code: 500,
                error: true,
                messageError: err
            })
        }
    } else {
        res.status(403).json({
            message: '',
            status_code: 403,
            error: true,
            messageError: `You can't unfollow yourself`
        })
    }
}

module.exports = {
    getUser,
    update,
    remove,
    follow,
    unfollow
}