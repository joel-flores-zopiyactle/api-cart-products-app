const { Router } = require('express')
const router = Router();
const UserModel = require('./../models/User')
const CryptoJS =  require('crypto-js')
const { verifyTokenAuthorization, verifyTokenAndAdmin } = require('./../handler/verifyToken')


router.put('/:id', verifyTokenAuthorization, async (req, res) => {

    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_ENCRY).toString()
    }
    
    try {
        
        const updateUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
    
        res.status(200).json(updateUser)

    } catch (error) {
        res.status(500).json(err)
    }

});


router.delete('/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        
        await UserModel.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted...')

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET user
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        
        const user = await UserModel.findById(req.params.id)
        const { password, ...others } = user._doc
        
        res.status(200).json(others)

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET  All User
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    
    const query  = req.query.new

    try {
        
        const users =  query 
        ? await UserModel.find().sort({_id: -1}).limit(5) 
        : await UserModel.find()
               
        res.status(200).json(users)

    } catch (error) {
        
        res.status(500).json(error)

    }
})

// GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {

    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await UserModel
        .aggregate([
            { $match: { createdAt: {$gte: lastYear}}},
            { $project: { month: { $month: "$createdAt"}}},
            { 
                $group: { 
                    id: '$month', 
                    total: { 
                        $sum: 1
                    }
                }
            }
        ])

        res.status(200).json(data)

    } catch (error) {
        res.status(500).json(error)
    }


})

module.exports = router
 