const express = require('express');
const morgan = require('morgan');
const connectDb = require('./dbConfig');
const app = express();
const passport = require('passport');

const products = require('./routes/products')
const users = require('./routes/customers')



require('dotenv').config();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(morgan('tiny'));
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

connectDb();

app.use('/api/products', products)
app.use('/api/users', users)

app.listen(3000, () => {
    console.log('server running on port 3000')
})