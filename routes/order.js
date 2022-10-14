const Order = require('../models/Order');
const Product = require('../models/Product')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATE
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json('No compete')
    }
})

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
            $set : req.body
            },
            {new : true}
    )
    res.status(200).json(updateOrder)
    } catch (err) {
        res.status(500).json('You can not update')
    }
})

//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order has been delete...')
    } catch (err) {
        res.status(500).json('You can not delete')
    }
})

//GET USER ORDERS
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({userId : req.params.userId})
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json('You can not find')
    }
})

//GET ALL PRODUCT
router.get('/',verifyTokenAndAuthorization ,async (req, res) => {
    try {
       const orders= await Order.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json('You can not find')
    }
})

// GET MONTHLY INCOME
router.get('/',verifyTokenAndAdmin ,async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Data().setMonth(lastMonth.getMonth() -1))

    try{
        const income = await Order.aggregate([
            {
                $match: { createdAt :{ $gte : previousMonth} }
            },
            {
                $project : {
                    month : { $month : '$createAt'},
                    sales : '$amount'
                },
            },
            {
                $group : {
                    _id : '$month',
                    total : {$sum : '$sales'}
                }
            }
        ])
        res.status(200).json(income)
    }catch{
        res.status(500).json('No compete')
    }
})

module.exports = router