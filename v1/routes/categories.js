const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { body, validationResult } = require('express-validator');


// @route   POST /api/categories
// @desc    Create a category to the database
// @access  Private
router.post('/',
    body('name').isLength({ min: 3 })
        .withMessage('Category name must have at least 3 characters')
    , (req, res) => {

        // Check is there any errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        Category.findOne({ name: req.body.name })
            .then(category => {
                if (category) {
                    return res.status(400).json({ msg: 'category already exist' })
                } else {
                    const category = new Category({
                        name: req.body.name,
                        icon: req.body.icon,
                        color: req.body.color
                    });

                    category.save()
                        .then(category => res.status(200).json(category))
                        .catch(err => res.send(err.message))
                }
            })
            .catch(err => console.log(err))
    })


// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.send(categoryList);
})


// @route   GET /api/categories/:id
// @desc    Get a category by its ID
// @access  Public
router.get('/:id', (req, res) => {
    Category.findById(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({ success: true, category })
            } else {
                return res.status(404).json({ success: false, msg: "category does not exist" })
            }
        })
        .catch(err => {
            console.log(err);
        })
})


// @route   PUT /api/categories/:id
// @desc    Updates the category
// @access  Private
router.put('/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, { new: true })
        .then(category => {
            if (category) {
                res.status(200).json({ success: true, category })
            } else {
                res.status(404).json({ success: false, msg: 'Category does not exist' })
            }
        })
        .catch(err => console.log(err))
})


// @route   DELETE /api/categories/:id
// @desc    Delete categories by id
// @access  Private
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (!category) {
                console.log("its not the category");
            } else {
                console.log("the category has been deleted");
            }
        })
        .catch(err => {
            console.log(err);
        })

})

module.exports = router;