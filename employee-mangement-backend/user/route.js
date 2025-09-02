const express=require('express');
const router=express.Router();
const { validationResult } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const userController=require('./controller');
const { updateEmployeeRoleValidation,paginationValidation,searchValidation } = require('../util/validation');

router.use(authenticateToken);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all employees (Manager/HR only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees retrieved successfully
 *       403:
 *         description: Unauthorized access
 */
router.get('/', 
    paginationValidation,
    searchValidation,
    userController.getAllEmployees
  );

  /**
 * @swagger
 * /api/user/role:
 *   put:
 *     summary: Update employee role (Manager/HR only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - userId
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [manager]
 *               userId:
 *                 type: string
 *                 description: Employee ID
 *     responses:
 *       200:
 *         description: Employee role updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Employee not found
 */
router.put('/role',
    authorizeRole(['manager', 'hr']),
    updateEmployeeRoleValidation,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    userController.updateEmployeeRole
  )


/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Soft delete employee (Manager/HR only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Employee not found
 */
router.delete('/delete',
    authorizeRole(['manager', 'hr']),
    userController.deleteEmployee
  );

router.get('/me',
  authenticateToken,
  userController.getLoggedInUserData
);
module.exports=router;