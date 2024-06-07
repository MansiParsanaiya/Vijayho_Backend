var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const connection = require('./connect');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const branchRoutes = require('./routes/branchRoutes');
const studentRoutes = require('./routes/studentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const feesRoutes = require('./routes/feesRoutes');
const courseRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connection();

// PORT
const PORT = process.env.PORT || 8000;

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/branch', branchRoutes);
app.use('/student', studentRoutes);
app.use('/employee', employeeRoutes);
app.use('/fees', feesRoutes);
app.use('/courses', courseRoutes);
app.use('/project', projectRoutes);
app.use('/task', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
