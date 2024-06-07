const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const archiveProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true }, 
    projectReference: { type: String, required: true },
    projectAmount: { type: Number, required: true },
    projectAssignee: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

archiveProjectSchema.plugin(mongoosePaginate);

const ArchiveProject = mongoose.model('ArchiveProject', archiveProjectSchema);

module.exports = ArchiveProject;
