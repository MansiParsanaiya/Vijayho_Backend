const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const taskSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskAssignees: { type: String, required: true },
    dueDate: { type: Date, required: true },
    projectStartDate: { type: Date, required: true },
    projectDueDate: { type: Date, required: true },
    status: { type: String }
});

taskSchema.plugin(mongoosePaginate);

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;
