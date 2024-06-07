const express = require('express');
const feesController = require('../controllers/feesController'); 

const router = express.Router();

router.post('/addFees', feesController.addFees);
router.get('/getInstallmentsByStudentId/:studentNumber',feesController.getInstallmentsByStudentId);
router.put('/updateInstallmentById/:id',feesController.updateInstallmentById);
router.get('/getInstallmentsByStudentIdAll/:studentNumber',feesController.getInstallmentsByStudentIdAll)

module.exports = router;
