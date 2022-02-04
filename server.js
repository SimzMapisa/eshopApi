const express = require('express');
const morgan = require('morgan');
const connectDb = require('./dbConfig');
const app = express();
const passport = require('passport');
const cors = require('cors')

const products = require('./routes/products')
const users = require('./routes/users')
const categories = require('./routes/categories')

require('dotenv').config();


// Middleware
app.use(cors())
app.options('*', cors)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(morgan('tiny'));
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

connectDb();

app.use('/api/products', products)
app.use('/api/users', users)
app.use('/api/categories', categories)

app.listen(3000, () => {
    console.log('server running on port 3000')
})