const Product = require('../models/Product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (err) {
        res.status(500).json('No compete')
    }
})

//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id,
            {
            $set : req.body
            },
            {new : true}
    )
    res.status(200).json(updateProduct)
    } catch (err) {
        res.status(500).json('You can not update')
    }
})

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('Product has been delete...')
    } catch (err) {
        res.status(500).json('You can not delete')
    }
})

//GET PRODUCT
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json('You can not find')
    }
})

//GET ALL PRODUCT
router.get('/', async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
       let products

       if(qNew){
        products = await Product.find().sort({createdAt: -1}).limit()
       }else if (qCategory){
            product = await Product.find({
              categories:{
                $in : [qCategory],
            }
        })
       }else{
            products = await Product.find()
       }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json('You can not find')
    }
})

module.exports = router