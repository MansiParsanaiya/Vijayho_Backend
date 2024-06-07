const Employee = require('../models/employee');
const ArchiveStudent = require("../models/archiveStudent")
const Fees = require('../models/fees');
const Income = require("../models/income");
const SequenceCounter = require('../models/counter');
const mongoose = require('mongoose');


module.exports.addEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee entry not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.deletedEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee entry not found' });
        }
        res.status(200).json({ message: 'Employee entry deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}