const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const archiveStudentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentNumber: { type: Number, required: true, unique:true}, // Assuming 10 digit number
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    parentNumber: { type: Number, required: true,unique:true}, // Assuming 10 digit number
    college: { type: String, required: true },
    qualification: { type: String, required: true },
    aadharCard: { type: Number, required: true, unique:true}, // Assuming 12 digit Aadhar number
    feesPay: { type: Number},
    amountPay: { type: Number},
    remainingFees: { type: Number}, 
    modeOfPayment: {type : String}
});


const archiveStudent = mongoose.model('ArchiveStudent', archiveStudentSchema);

module.exports = archiveStudent;
