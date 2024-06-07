const express = require('express');
const studentController = require('../controllers/studentController'); 

const router = express.Router();

router.post('/addStudent', studentController.addStudent);
router.get('/getStudent', studentController.getAllStudents);
router.delete('/deleteStudent/:id', studentController.deletedStudent);
router.put('/updateStudent/:id', studentController.updateStudent);
router.get('/getoneStudent/:id', studentController.getoneStudent);

module.exports = router;
