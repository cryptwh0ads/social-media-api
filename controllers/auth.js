const User = require('../models/Users')
const bcrypt = require('bcrypt')

// Register
const register = async (req, res) => {
    // Get data in the body of request
    const {username, email, password} = req.body

    // Hash the user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new User based on User's Schema
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        // Create a new User on database
        await newUser.save()

        // Send back to response
        res.status(200).json({
            message: `The user ${username} has been created`,
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

// Login
const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const searchUser = await User.findOne({ email })

        !searchUser && res.status(400).json({
            message: ``,
            status_code: 400,
            error: true,
            messageError: `Not found user with this email or password. Check and try again!`
        })

        const validPass = await bcrypt.compare(password, searchUser.password)
        !validPass && res.status(400).json({
            message: ``,
            status_code: 400,
            error: true,
            messageError: `Not found user with this email or password. Check and try again!`
        })

        res.status(200).json({
            message: `The user ${searchUser.username} has been authenticated`,
            status_code: 200,
            error: false,
            messageError: ''
        })
    } catch (err) {
        res.status(500).json({
            message: ``,
            status_code: 500,
            error: true,
            messageError: err
        })
    }
}

module.exports = {
    register,
    login
}