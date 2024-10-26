const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const signupValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').exists().withMessage('Password is required'),
    validate
];

const taskValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
    validate
];

module.exports = { signupValidation, loginValidation, taskValidation };