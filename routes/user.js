const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();



//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.APP_SECRET
        ).toString()
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {
            $set : req.body
            },
            {new : true}
    )
    res.status(200).json(updateUser)
    } catch (err) {
        res.status(500).json('You can not update')
    }
})

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been delete...')
    } catch (err) {
        res.status(500).json('You can not delete')
    }
})

//GET ALL USER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query
        ? await User.find().sort({ _id: -1}).limit(10)
        : await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json('You can not find')
    }
})

//GET USER ID
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
       
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json('You can not find')
    }
})
module.exports = router