const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const feesSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentNumber: { type: Number, required: true }, 
    feesPay: { type: Number, required: true },
    amountPay: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    remainingFees: { type: Number, required: true },
    modeOfPayment: {type : String,required:true},
    date: { type: Date, default: Date.now },
    installIncomeId : { type : String, required: true}
});

feesSchema.plugin(mongoosePaginate);


const Fees = mongoose.model('Fees', feesSchema);

module.exports = Fees;
