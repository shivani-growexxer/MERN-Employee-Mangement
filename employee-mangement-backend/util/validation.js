const {body,query}=require('express-validator');

exports.registerValidation=[
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['manager','hr','employee']).withMessage('Invalid role'),
    body('department')
    .if(body('role').equals('employee'))
    .notEmpty()
    .withMessage('Department is required for employees')
    .isIn(['IT','HR','Marketing','Sales','Finance','Engineering','Design'])
    .withMessage('Invalid department'),
    body('projects')
        .if(body('role').equals('employee'))
        .notEmpty()
        .withMessage('Projects are required for employees')
        .isArray()
        .withMessage('Projects must be an array'),
];

exports.loginValidation=[
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
];

exports.updateEmployeeRoleValidation=[
    body('role').notEmpty().isIn(['manager','hr','employee']).withMessage('Role is required!'),
    body('userId').notEmpty().withMessage('User ID is required'),
];

exports.searchValidation=[
    query('search').optional().trim().isLength({min:3,max:100}).isString().withMessage('Search must be a string')
];

exports.paginationValidation=[
    query('page').optional().isInt({min:1}).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({min:1,max:100}).withMessage('Limit must be a positive integer between 1 and 100'),
    query('sortBy').optional().isIn(['name','email','createdAt']).withMessage('Invalid sort field'),
    query('order').optional().isIn(['asc','desc']).withMessage('Invalid order'),
]