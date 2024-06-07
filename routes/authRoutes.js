// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/oneuser', authController.getOneUser);
router.post('/approve', authController.userApprove);
router.post('/reject', authController.userReject);
router.post('/getUserWithActive',authController.getUserWithActive)

router.get('/totalCount',authController.totalCount)


module.exports = router;
