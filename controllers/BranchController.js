const Branch = require('../models/branch'); 

const branchController = {
  addBranch: async (req, res) => {
    try {
      const { branchId, name } = req.body;

      if (!branchId || !name) {
        return res.status(400).json({ error: 'Both id and name are required fields.' });
      }

      const newBranch = new Branch({ branchId, name });

      await newBranch.save();

      res.status(201).json({ message: 'Branch added successfully', branch: newBranch });
    } catch (error) {
      console.error('Error adding branch:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllBranches: async (req, res) => {
    try {
      const branches = await Branch.find();
      res.status(200).json(branches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
}

module.exports = branchController;
