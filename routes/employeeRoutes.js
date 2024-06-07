const express = require('express');
const employeeController = require('../controllers/employeeController'); 

const router = express.Router();

router.post('/addEmployee', employeeController.addEmployee);
// router.get('/getEmployee', employeeController.getAllEmployees);
router.delete('/deleteEmployee/:id', employeeController.deletedEmployee);
router.put('/updateEmployee/:id', employeeController.updateEmployee);
// router.get('/getoneEmployee/:id', employeeController.getoneEmployee);

module.exports = router;
