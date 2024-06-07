const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRECT = "ewf98we789ew7v897vdcsc()EF*E(^FE"

const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRECT);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Only admin can access this resource' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};


// router.post('/addExpense', isAdmin, accountController.addExpense);
// router.delete('/deleteExpense/:id', isAdmin, accountController.deleteExpense);
// router.put('/updateExpense/:id', isAdmin, accountController.updateExpense);
// router.get('/viewExpense', isAdmin, accountController.getExpense);
// router.get('/totalExpense', isAdmin, accountController.totalExpense);

// router.post('/addIncome', isAdmin, accountController.addIncome);
// router.delete('/deleteIncome/:id', isAdmin, accountController.deleteIncome);
// router.put('/updateIncome/:id', isAdmin, accountController.updateIncome);
// router.get('/viewIncome', isAdmin, accountController.getIncome)
// router.get('/totalIncome', isAdmin, accountController.totalIncome);

router.post('/addExpense', accountController.addExpense);
router.delete('/deleteExpense/:id',  accountController.deleteExpense);
router.put('/updateExpense/:id',  accountController.updateExpense);
router.get('/viewExpense',  accountController.getAllExpense);
router.get('/viewExpense/:branchId',  accountController.getExpense);
router.get('/getExpense/:id', accountController.getoneExpense);
router.get('/totalExpense',  accountController.totalExpense);
router.get('/totalExpense/:branchId',  accountController.totalExpenseBranch)

router.post('/addIncome',  accountController.addIncome);
router.delete('/deleteIncome/:id',  accountController.deleteIncome);
router.put('/updateIncome/:id',  accountController.updateIncome);
router.get('/viewIncome',  accountController.getAllIncome);
router.get('/viewIncome/:branchId',  accountController.getIncome);
router.get('/getIncome/:id', accountController.getoneIncome);
router.get('/totalIncome',  accountController.totalIncome)
router.get('/totalIncome/:branchId',  accountController.totalIncomeBranch)


module.exports = router;
