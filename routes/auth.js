const { Router } = require('express')
const CryptoJS =  require('crypto-js')
const jwt = require('jsonwebtoken')
const router = Router()
const UserModel = require('./../models/User')


router.post('/register', async (req, res) => {

    const newUser = new UserModel({
        username : req.body.username,
        email    : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_ENCRY).toString() 
    })

    try {
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.post('/login', async (req, res) => {

   try {

    const user = await UserModel.findOne({username: req.body.username})

    !user && res.status(500).json("Wrong credentials!")

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_ENCRY)
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

    OriginalPassword !== req.body.password && res.status(500).json('Wrong credentials!')

    // Generamos un TOKEN
    const token = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, 
    {
        expiresIn: "3d"
    }
    ) 

    const {password, ...others} = user._doc // Removemos el password del objeto para no mostrar

    res.status(200).json({...others, token});

   } catch (error) {

       res.status(500).json(error)
   }
})





module.exports = router
