const Attendance = require("../Model/attendanceModel");
const Employee = require("../Model/EmployeeModel")

//UPDATE ATTENDANCE
exports.updateAttendance = async (req, res) => {
  try {
    const { employeeID, date } = req.params;

    const updateDate = new Date(date);

    const existingAttendance = await Attendance.findOne({
      employeeID,
      date: { $gte: updateDate, $lt: new Date(updateDate.getTime() + 86400000) },
    });

    if (existingAttendance) {
      const { attendance } = existingAttendance;

      if (attendance === req.body.attendance) {
        return res.status(400).json({ status: false, data: `Attendance is already marked as ${req.body.attendance}.` });
      }
    }

    const updatedAttendance = await Attendance.findOneAndUpdate(
      {
        employeeID,
        date: { $gte: updateDate, $lt: new Date(updateDate.getTime() + 86400000) },
        attendance: { $ne: req.body.attendance },
      },
      { $set: req.body },
      { new: true }
    )

    if (!updatedAttendance) {
      return res.status(404).json({ status: false, data: `Attendance record not found` });
    }

    console.log(updatedAttendance);

    return res.status(200).json({ status: true, data: `Enrollment Number ${employeeID} attendance updated successfully!`, data: updatedAttendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: 'Internal Server Error' });
  }
}

// Add Attendance
exports.addAttendance = async (req, res) => {
  try {
    let { employeeID, attendance, date } = req.body;
    console.log(date, 'i am cdate')

    if (!attendance) {
      attendance = null;
    }

    if (!date) {
      date = new Date();
    }
    else {
      date = new Date(date);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ status: false, data: 'Invalid date format. Please provide a valid date.' });
      }
    }

    const employeeExists = await Employee.exists({ employeeID });

    if (!employeeExists) {
      return res.status(400).json({ status: false, data: `Employee with employeeID ${employeeID} does not exist.` });
    }

    const formattedDate = date.toISOString().split('T')[0];

    const existingAttendance = await Attendance.findOne({
      employeeID,
      date: { $gte: formattedDate, $lt: new Date(date.getTime() + 86400000).toISOString().split('T')[0] },
    })

    if (existingAttendance) {
      return res.status(400).json({ message: `Attendance record already exists for employee id ${employeeID} on ${formattedDate}.` });
    }

    console.log({
      employeeID,
      date: { $gte: formattedDate, $lt: new Date(date.getTime() + 86400000).toISOString().split('T')[0] },
    })

    const studentAttendance = new Attendance({ employeeID, attendance, date });
    await studentAttendance.save();

    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal Server Error' });
  }
}
