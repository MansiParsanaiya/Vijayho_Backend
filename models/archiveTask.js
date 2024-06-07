const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const archiveTaskSchema = new mongoose.Schema({
    projectId: {type: String, required: true},
    projectName: { type: String, required: true },
    taskDescription: { type: String, required: true }, 
    taskAssignees: { type: String, required: true },
    dueDate: { type: Date, required: true },
});

archiveTaskSchema.plugin(mongoosePaginate);


const ArchiveTasks = mongoose.model('ArchiveTasks', archiveTaskSchema);

module.exports = ArchiveTasks;
