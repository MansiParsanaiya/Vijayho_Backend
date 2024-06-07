const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const employeeSchema = new mongoose.Schema({
    employeeID: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: Number },
    address: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], default: null, required: true },
    dob: { type: Date, required: true },
    contactNo: { type: Number, required: true },
    profileImage: { type: String },
    dateOfJoining: { type: Date, default: Date.now},
    userType: { type: String, default: 'employee', required: true },
});

employeeSchema.plugin(mongoosePaginate);

// Pre-save middleware to generate employeeID
employeeSchema.pre('save', async function (next) {
    const employee = this;
    if (employee.isNew) {
        try {
            // Find the last inserted employee to get the latest employeeID
            const lastEmployee = await Employee.findOne().sort({ employeeID: -1 });
            let newEmployeeID = 'EMP1'; // Default employeeID for the first document

            if (lastEmployee) {
                // Extract numeric part from the last employeeID and increment it
                const lastID = parseInt(lastEmployee.employeeID.replace('EMP', ''));
                newEmployeeID = 'EMP' + (lastID + 1);
            }

            employee.employeeID = newEmployeeID;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
