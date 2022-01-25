const express = require('express')
const router = express.Router();
const Customer = require('../models/Customer');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt')

// @route   POST /register
// @desc    Create user accounts for customers
// @access  Public
router.post('/register', (req, res) => {
    Customer.findOne({ email: req.body.email })
        .then((customer) => {
            if (customer) {
                return res.status(400).json({ email: "account already exist please login instead!" })
            } else {

                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg',  //raitng
                    d: 'mm'   // default
                })

                const newCustomer = new Customer({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newCustomer.password, salt, (err, hash) => {
                        if (err) throw err;
                        newCustomer.password = hash;
                        newCustomer.save()
                            .then(customer => res.json(customer))
                            .catch(error => console.log(error))
                    })
                })
            }
        })
})

// @route   GET /users/login
// @desc    Login User / Return JWT Token
// @access  Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find User by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "User not found" });
            }
            // check passwords
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    res.json({ msg: "Password matched" })
                })
        })
})

module.exports = router;