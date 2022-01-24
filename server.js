const express = require('express');
const morgan = require('morgan');
const connectDb = require('./dbConfig');
const app = express();

const products = require('./routes/products')



require('dotenv').config();


// Middleware
app.use(express.json())
app.use(morgan('tiny'));

connectDb();

app.use('/api/products', products)

app.listen(3000, () => {
    console.log('server running on port 3000')
})