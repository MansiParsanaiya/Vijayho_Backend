const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const attendanceSchema = new mongoose.Schema({
  employeeID: { type: Number, required: true },
  attendance: { type: String, enum: ['Present', 'Absent'], default: null, required: true },
  date: { type: Date, default: Date.now, required: true },
})

attendanceSchema.plugin(mongoosePaginate);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
