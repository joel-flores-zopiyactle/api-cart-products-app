const { Router } = require('express')
const router = Router();
const ProductModel = require('./../models/Product')
const CryptoJS =  require('crypto-js')
const { verifyTokenAuthorization, verifyTokenAndAdmin } = require('./../handler/verifyToken')


router.post('/', verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new ProductModel({
        title:      req.body.title,
        desc:       req.body.desc,
        img:        req.body.img,
        categories: req.body.categories,
        size:       req.body.size,
        color:      req.body.color,
        price:      req.body.price,
    })

    try {
        
       const product = await newProduct.save()

       res.status(201).json(product)

    } catch (error) {
        res.status(500).json(error)
    }


})


router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

        
    try {
        
        const updateProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
    
        res.status(200).json(updateProduct)

    } catch (error) {
        res.status(500).json(err)
    }

});


router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        
        await ProductModel.findByIdAndDelete(req.params.id)
        res.status(200).json('Product has been deleted...')

    } catch (error) {
        
        res.status(500).json(error)

    }
})


// GET Product
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        
        const product = await ProductModel.findById(req.params.id)
              
        res.status(200).json(product)

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET  All User
router.get('/', async (req, res) => {
    
    const qNew  = req.query.new
    const qCategory = req.query.category

    try {
        let products;
        
        if(qNew) {
            products = await ProductModel.find().sort({ createdAt: -1}).limit(1)
        } else if (qCategory) {
            products = await ProductModel.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await ProductModel.find()
        }
       
               
        res.status(200).json(products)

    } catch (error) {
        
        res.status(500).json(error)

    }
})





module.exports = router
 