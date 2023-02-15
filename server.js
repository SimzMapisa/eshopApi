const express = require('express');
const morgan = require('morgan');
const connectDb = require('./dbConfig');
const app = express();
const passport = require('passport');
const cors = require('cors');

const products = require('./v1/routes/products');
const users = require('./v1/routes/users');
const categories = require('./v1/routes/categories');
const createAccount = require('./v1/routes/users');

// Middleware
app.use(cors());
app.options('*', cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

connectDb();

app.use('/api/v1/products', products);
app.use('/api/v1/users', users);
app.use('/api/v1/categories', categories);

app.listen(3000, () => {
	console.log('server running on port 3000');
});
