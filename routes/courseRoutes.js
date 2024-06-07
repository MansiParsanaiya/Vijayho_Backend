// courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/coursesController');

// Route to get all courses
router.get('/getCourses', courseController.getAllCourses);

module.exports = router;
