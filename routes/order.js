const { Router } = require('express')
const router = Router();
const OrderModel = require('./../models/Order')
const { verifyTokenAuthorization, verifyTokenAndAdmin, verifyToken } = require('./../handler/verifyToken')


router.post('/', verifyToken, async (req, res) => {

    const newOrder = new OrderModel(req.body)

    try {
        
       const order = await newOrder.save()

       res.status(201).json(order)

    } catch (error) {
        res.status(500).json(error)
    }


})


router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

        
    try {
        
        const updateOrder = await OrderModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
    
        res.status(200).json(updateOrder)

    } catch (error) {
        res.status(500).json(err)
    }

});


router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        
        await OrderModel.findByIdAndDelete(req.params.id)
        res.status(200).json('Order has been deleted...')

    } catch (error) {
        
        res.status(500).json(error)

    }
})


// GET USER order  (user id)
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        
        const order = await OrderModel.findOne({useId: req.params.id})
              
        res.status(200).json(order)

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET  All User
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    
    try {
        
        const orders = await OrderModel.find()

               
        res.status(200).json(orders)

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res)=> {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1 ))

    try {
        

        const income = await OrderModel.aggregate([
            { 
                $match: { 
                    createdAt: { 
                        $gte: previousMonth 
                    }
                } 
            },

            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
                
                $group: {
                    _id: "$mount",
                    total: {$sum:  "$sales" },
                }
            }
        ])

        res.status(200).json(income)


    } catch (error) {
        res.status(500).json(error)
    }
})





module.exports = router
 