// branchRoutes.js

const express = require('express');
const branchController = require('../controllers/BranchController'); 

const router = express.Router();

router.post('/addBranch', branchController.addBranch);
router.get('/getBranch', branchController.getAllBranches);


module.exports = router;
