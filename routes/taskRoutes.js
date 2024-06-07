const express = require('express');
const taskController = require('../controllers/tasksController'); 

const router = express.Router();

router.post('/addTask', taskController.addTasks);
router.get('/getTaskByProjectId/:projectId',taskController.getTaskByProjectId);
router.put('/updateTaskById/:id',taskController.updateTaskById);
router.delete('/deleteTaskById/:id',taskController.deleteTaskById);
router.get('/getTasksByUser/:id/:user',taskController.getTasksByUser);
router.patch('/updateProjectDetailsInTasks/:projectId',taskController.updateProjectDetailsInTasks),
router.get('/getTasksByUserAndTime/:user',taskController.getTasksByUserAndTime),
router.get('/getAllTask',taskController.getAllTask),
router.patch('/patchUpdateTaskById/:id',taskController.patchUpdateTaskById),
router.delete('/deleteTasksByProjectId/:projectId',taskController.deleteTasksByProjectId)

module.exports = router;
