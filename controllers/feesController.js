const Fees = require('../models/fees');

module.exports.addFees = async (req, res) => {

    const { studentName, studentNumber, feesPay, amountPay, amountPaid, remainingFees, modeOfPayment ,installIncomeId} = req.body;

    Fees.create({ studentName, studentNumber, feesPay, amountPay, amountPaid, remainingFees, modeOfPayment,installIncomeId })
        .then((data) => {
            console.log("Saved successfully");
            res.status(201).send(data);
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.getInstallmentsByStudentId = async (req, res) => {
    const { studentNumber } = req.params;

    try {
        
        const { page, limit, search } = req.query;

        const query = {studentNumber: studentNumber};
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };



        if (search !== undefined && search !== null && search !== "") {
            if (!isNaN(search)) {
                query.$or = [
                    { feesPay: parseFloat(search) },
                    { amountPay: parseFloat(search) },
                    { remainingFees: parseFloat(search) },
                    { studentNumber: parseFloat(search) },
                ];
            } else {
                query.$or = [
                    { studentName: { $regex: new RegExp(search, 'i') } },
                    { modeOfPayment: { $regex: new RegExp(search, 'i') } },
                ];
            }
        }


        const installments = await Fees.paginate(query,options);
        res.status(200).json({ success: true, data: installments });
    } catch (error) {
        console.error('Error fetching fee installments:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.updateInstallmentById = async (req, res) => {
    const { id } = req.params; 
    const updateFields = req.body;

    try {
        const updatedInstallment = await Fees.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedInstallment) {
            return res.status(404).json({ success: false, error: 'Fee installment not found' });
        }

        res.status(200).json({ success: true, data: updatedInstallment });
    } catch (error) {
        console.error('Error updating fee installment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.getInstallmentsByStudentIdAll = async (req, res) => {
    const { studentNumber } = req.params;

    try {
        
        const query = {studentNumber: studentNumber};
        
        const installments = await Fees.find(query);
        res.status(200).json({ success: true, data: installments });
    } catch (error) {
        console.error('Error fetching fee installments:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
