const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')

dotenv.config();
app.use(express.json())

// Conexion a BD
// Arrancar mongo sudo systemctl start mongod
// EStado mongo sudo systemctl status mongod
// Parar mongo sudo systemctl stop mongod
// Restaurar sudo systemctl restart mongod

mongoose.connect(process.env.MONGO_URL) //TODO: Add url of MongoDB
.then(() => {
    console.log('DBConnection successfull');
})
.catch((err) => {
    console.log(err);
})

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);


// Server
app.listen(process.env.PORT || 3000, () => {
    console.log('Backend server in running...');
})

