const express = require('express')
const router = express.Router();
const Customer = require('../models/Customer');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');


// @route   POST /register
// @desc    Create user accounts for customers
// @access  Public
router.post('/register',
    body('email').isEmail().normalizeEmail(),
    body('name').isLength({ min: 2 }),
    body('surname').isLength({ min: 2 }),
    body('password').isLength({ min: 5 })
        .isLength({ min: 5 })
        .withMessage('password must be at least 5 characters')
        .matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')
        .withMessage('Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),


    (req, res) => {

        // Check is there any errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the user already exist
        Customer.findOne({ email: req.body.email })
            .then((customer) => {
                if (customer) {
                    return res.status(400).json({ email: "account already exist please login instead!" })
                } else {

                    // If the user doesnt already exist get their gravatar and store in a variable
                    const avatar = gravatar.url(req.body.email, {
                        s: '200', //size
                        r: 'pg',  //raitng
                        d: 'mm'   // default
                    })

                    // Use the customer model to create a new instance of the customer
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
    Customer.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "User not found" });
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        // create jwt payload
                        const payload = { id: user.id, email: user.email, avatar: user.avatar }
                        // sign token
                        jwt.sign(payload,
                            process.env.secretOrKey,
                            { expiresIn: 3600 }, (err, token) => {
                                res.json({ success: true, token: 'Bearer ' + token })
                            })
                    } else {
                        return res.status(400).json({ password: "Invalid Password" });
                    }
                })
        })
})

// @route   GET /api/users/current
// @desc    Returns  the current user
// @access  Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        surname: req.user.surname,
        email: req.user.email
    })
})

module.exports = router;