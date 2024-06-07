const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const archiveExpenseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    title: { type: String, required: true  },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    user: { type: String},
    branchId: { type: Number },
    lastEdit: {type : String},
    modeOfPayment: {type : String}
});


const archiveExpense = mongoose.model('ArchiveExpense', archiveExpenseSchema);

module.exports = archiveExpense;
