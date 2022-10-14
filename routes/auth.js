const router = require('express').Router()
const User = require('../models/User')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

//REGISTER
router.post('/register', async (req, res) => {
    const newUser = new User ({
        username : req.body.username,
        email : req.body.email,
        password : cryptoJs.AES.encrypt(
            req.body.password, 
            process.env.APP_SECRET
            ).toString()
    })
    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }catch (err) {
        res.status(500).json(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username : req.body.username})
        !user && res.status(401).json({
            message :'you con not login'
        })
        const hashPassword =  cryptoJs.AES.decrypt(
            user.password,
            process.env.APP_SECRET
        ) 
        const oriPassword = hashPassword.toString(cryptoJs.enc.Utf8)

        oriPassword !== req.body.password && 
            res.status(401).json('password is valid')

            const accessToken = jwt.sign({
                id:user._id, 
                isAdmin: user.isAdmin,
            }, process.env.JWT_SECRET,
                {expiresIn:'1d'}
            )

        const {password, ...others } = user._doc
        res.status(200).json({others, accessToken})
    } catch (err) {
        res.status(500).json({
            message : 'login error'
        })
    }
})

module.exports = router