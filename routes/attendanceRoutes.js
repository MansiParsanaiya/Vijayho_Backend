const express = require('express');
const router = express.Router();
const Attendancecontroller = require('../Controller/AttendanceController');

router.post('/addAttendance/:employeeID', Attendancecontroller.addAttendance)

router.patch('/updateAttendance/:employeeID/:date', Attendancecontroller.updateAttendance);

module.exports = router;