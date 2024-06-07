const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const archiveIncomeSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    title: { type: String , required: true },
    description: { type: String, required: true },
    amount: { type: String, required: true},
    user: { type: String},
    branchId: { type: Number },
    lastEdit: {type : String},
    modeOfPayment: {type : String}
});


const archiveIncome = mongoose.model('ArchiveIncome', archiveIncomeSchema);

module.exports = archiveIncome;
