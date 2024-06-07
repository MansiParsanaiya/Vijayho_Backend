const Income = require("../models/income")
const Expense = require("../models/expense")
const ArchiveIncome = require("../models/archiveIncome")
const ArchiveExpense = require("../models/archiveExpense")


const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRECT = "ewf98we789ew7v897vdcsc()EF*E(^FE"

module.exports.getIncome = async (req, res) => {
    try {
        const { branchId } = req.params;
        console.log(branchId);

        // const { page, limit, search } = req.query;
        // console.log(search, "i am the value of search");
        const { page, limit, search } = req.query;


        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const query = { branchId: branchId };

        // if (search !== undefined && search !== null) {

        //     query.$or = [
        //         { amount: { $regex: new RegExp(search, 'i') } },
        //         { title: { $regex: new RegExp(search, 'i') } },
        //         { description: { $regex: new RegExp(search, 'i') } },
        //         { modeOfPayment: { $regex: new RegExp(search, 'i') } },
        //     ];

        // }
        console.log(search,"i m calling from getapi search value")
        if (search !== undefined && search !== null && search!=="") {
            if (!isNaN(search)) { // Check if search value is numeric
                query.amount = parseFloat(search); // Search only on amount field
            } else {
                query.$or = [
                    { title: { $regex: new RegExp(search, 'i') } },
                    { description: { $regex: new RegExp(search, 'i') } },
                    { modeOfPayment: { $regex: new RegExp(search, 'i') } },
                ];
            }
        }

        const incomes = await Income.paginate(query, options);
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getAllIncome = async (req, res) => {
    const income = await Income.find({}, { __v: 0 });
    res.send(income);
};

module.exports.getoneIncome = async (req, res) => {
    try {
        const { _id } = req.params
        const income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports.addIncome = async (req, res) => {
    const { date, title, description, amount, user, branchId, lastEdit, modeOfPayment } = req.body;
    console.log(modeOfPayment);

    Income.create({ date, title, description, amount, user, branchId, lastEdit, modeOfPayment })
        .then((data) => {
            console.log("Saved successfully");
            res.status(201).send(data);
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.updateIncome = async (req, res) => {
    const { id } = req.params
    const { date, title, description, amount, lastEdit, modeOfPayment } = req.body;

    Income.findByIdAndUpdate(id, { date, title, description, amount, lastEdit, modeOfPayment }, { new: true })
        .then((data) => {
            console.log("Update successfully");
            res.status(201).send({ data, user });
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;

    try {
        const deletedIncome = await Income.findById(id);

        if (deletedIncome) {
            const archiveIncome = new ArchiveIncome(deletedIncome.toObject());
            await archiveIncome.save();
        }

        await Income.findByIdAndDelete(id);

        console.log("Deleted successfully");
        res.status(201).send({ data: deletedIncome, user });
    } catch (err) {
        console.log(err);
        res.send({ error: err, msg: "Something went wrong" });
    }

};

module.exports.totalIncome = async (req, res) => {
    try {
        const totalIncome = await Income.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const total = totalIncome.length > 0 ? totalIncome[0].total : 0;

        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

module.exports.totalIncomeBranch = async (req, res) => {
    const { branchId } = req.params;

    const incomes = await Income.find({ branchId });

    const totalCashIncome = incomes.reduce((total, income) => (income.modeOfPayment === 'cash' ? total + parseInt(income.amount) : total), 0);
    const totalBankIncome = incomes.reduce((total, income) => (income.modeOfPayment === 'bank' ? total + parseInt(income.amount) : total), 0);
    const totalIncome = totalCashIncome + totalBankIncome;

    const responseData = {
        docs: incomes,
        totalCashIncome,
        totalBankIncome,
        totalIncome,

    };

    res.json(responseData);

};

module.exports.getExpense = async (req, res) => {
    try {
        const { branchId } = req.params;
        console.log(branchId);

        const { page, limit, search } = req.query;


        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const query = { branchId: branchId };

        if (search !== undefined && search !== null && search!=="") {
            if (!isNaN(search)) { // Check if search value is numeric
                query.amount = parseFloat(search); // Search only on amount field
            } else {
                query.$or = [
                    { title: { $regex: new RegExp(search, 'i') } },
                    { description: { $regex: new RegExp(search, 'i') } },
                    { modeOfPayment: { $regex: new RegExp(search, 'i') } },
                ];
            }
        }

        const expenses = await Expense.paginate(query, options);
        console.log(expenses,"i m calling from api")
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getAllExpense = async (req, res) => {
    const expense = await Expense.find({}, { __v: 0 });
    res.send(expense);
};

module.exports.addExpense = async (req, res) => {
    const { id, date, title, description, amount, user, branchId, lastEdit, modeOfPayment } = req.body;

    Expense.create({ id, date, title, description, amount, user, branchId, lastEdit, modeOfPayment })
        .then((data) => {
            console.log("Saved successfully");
            res.status(201).send(data);
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.updateExpense = async (req, res) => {
    const { id } = req.params
    const { date, title, description, amount, lastEdit, modeOfPayment } = req.body;

    Expense.findByIdAndUpdate(id, { date, title, description, amount, lastEdit, modeOfPayment }, { new: true })
        .then((data) => {
            console.log("Update successfully");
            res.status(201).send({ data, user });
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;

    try {
        const deletedExpense = await Expense.findById(id);

        if (deletedExpense) {
            const archiveExpense = new ArchiveExpense(deletedExpense.toObject());
            await archiveExpense.save();
        }

        await Expense.findByIdAndDelete(id);

        console.log("Deleted successfully");
        res.status(201).send({ data: deletedExpense, user });
    } catch (err) {
        console.log(err);
        res.send({ error: err, msg: "Something went wrong" });
    }

};

module.exports.totalExpense = async (req, res) => {
    try {
        const totalExpense = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const total = totalExpense.length > 0 ? totalExpense[0].total : 0;

        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

module.exports.totalExpenseBranch = async (req, res) => {
    const { branchId } = req.params;

    const expenses = await Expense.find({ branchId });

    const totalCashExpense = expenses.reduce((total, expense) => (expense.modeOfPayment === 'cash' ? total + parseInt(expense.amount) : total), 0);
    const totalBankExpense = expenses.reduce((total, expense) => (expense.modeOfPayment === 'bank' ? total + parseInt(expense.amount) : total), 0);
    const totalExpense = totalCashExpense + totalBankExpense;

    const responseData = {
        docs: expenses,
        totalCashExpense,
        totalBankExpense,
        totalExpense,

    };

    res.json(responseData);

};

module.exports.getoneExpense = async (req, res) => {
    try {
        const { _id } = req.params
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};