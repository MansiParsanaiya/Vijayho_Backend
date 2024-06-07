// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/role_admin', userController.getAdminUsers);
router.get('/role_user', userController.getUserUsers);
router.post('/user_role', userController.getUserFromToken);

module.exports = router;
