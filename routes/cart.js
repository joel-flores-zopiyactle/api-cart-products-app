const { Router } = require('express')
const router = Router();
const CartModel = require('./../models/Cart')
const CryptoJS =  require('crypto-js')
const { verifyTokenAuthorization, verifyTokenAndAdmin, verifyToken } = require('./../handler/verifyToken')


router.post('/', verifyToken, async (req, res) => {

    const newCart = new CartModel({
        products: req.body.products,
        userId:   req.body.userId
    })

    try {
        
       const cart = await newCart.save()

       res.status(201).json(cart)

    } catch (error) {
        res.status(500).json(error)
    }


})


router.put('/:id', verifyTokenAuthorization, async (req, res) => {

        
    try {
        
        const updateCart = await CartModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
    
        res.status(200).json(updateCart)

    } catch (error) {
        res.status(500).json(err)
    }

});


router.delete('/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        
        await CartModel.findByIdAndDelete(req.params.id)
        res.status(200).json('Cart has been deleted...')

    } catch (error) {
        
        res.status(500).json(error)

    }
})


// GET USER Product  (user id)
router.get('/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        
        const cart = await CartModel.findOne({useId: req.params.id})
              
        res.status(200).json(cart)

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET  All User
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    
    try {
        
        const carts = await CartModel.find()

               
        res.status(200).json(carts)

    } catch (error) {
        
        res.status(500).json(error)

    }
})





module.exports = router
 