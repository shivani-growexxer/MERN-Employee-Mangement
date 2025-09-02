const express=require('express');
const router=express.Router();
const authController=require('./controller');
const { registerValidation,loginValidation } = require('../util/validation');
const { validationResult } = require('express-validator');


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [manager, hr,employee]
 *               department:
 *                 type: string
 *                 enum: [IT, HR, Marketing, Sales, Finance, Engineering, Design]
 *               joiningDate:
 *                 type: string
 *                 format: date
 *               projects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Project 1
 *                   - Project 2
 *                   - Project 3
 *             example:
 *               name: John Doe
 *               email: john.doe@example.com
 *               password: password123
 *               role: manager
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error
 */
router.post('/register',registerValidation,(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
},authController.register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post('/login',loginValidation,(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
},authController.login);

router.post('/logout', authController.logout);

module.exports=router;