const express = require('express');
const projectController = require('../controllers/projectController'); 

const router = express.Router();

router.post('/addProject', projectController.createProject);
router.get('/getProject', projectController.getAllProjects);
router.delete('/deleteProject/:id', projectController.deleteProject);
router.put('/updateProject/:id', projectController.updateProject);
router.get('/getAllProjectName',projectController.getAllProjectName)

module.exports = router;
