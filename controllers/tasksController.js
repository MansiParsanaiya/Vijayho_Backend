const Task = require('../models/task');
const ArchiveTasks = require("../models/archiveTask")
const moment = require('moment');


module.exports.addTasks = async (req, res) => {

    const { projectId, projectName, taskDescription, taskAssignees, dueDate, projectStartDate, projectDueDate } = req.body;

    Task.create({ projectId, projectName, taskDescription, taskAssignees, dueDate, projectStartDate, projectDueDate })
        .then((data) => {
            console.log("Saved successfully");
            res.status(201).send(data);
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.getTaskByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {

        const { page, limit, search } = req.query;

        const query = { projectId: projectId };
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };



        if (search) {
            query.$or = [
                { taskDescription: { $regex: new RegExp(search, 'i') } },
                { taskAssignees: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const tasks = await Task.paginate(query, options);
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.deleteTasksByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await Task.deleteMany({ projectId: projectId });
        res.status(200).json({ success: true, message: `${result.deletedCount} tasks deleted successfully` });
    } catch (error) {
        console.error('Error deleting tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.updateTaskById = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error('Error updating fee tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.patchUpdateTaskById = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error('Error updating fee tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.deleteTaskById = async (req, res) => {

    const { id } = req.params;
    try {
        const deletedTask = await Task.findById(id);

        if (deletedTask) {
            const archiveTasks = new ArchiveTasks(deletedTask.toObject());
            await archiveTasks.save();
        }

        await Task.findByIdAndDelete(id);

        console.log("Deleted successfully");
        res.status(201).send({ data: deletedTask });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getTasksByUser = async (req, res) => {
    const { id, user } = req.params;

    try {

        const { page, limit, search } = req.query;



        const query = { projectId: id, taskAssignees: { $regex: `(^|,\\s*)${user}(\\s*,|$)` } };
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        if (search) {
            query.$or = [
                { taskDescription: { $regex: new RegExp(search, 'i') } },
                { taskAssignees: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const tasks = await Task.paginate(query, options);
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.updateProjectDetailsInTasks = async (req, res) => {
    const { projectId } = req.params;
    const { projectName, projectStartDate, projectDueDate } = req.body;

    try {
        const updateResult = await Task.updateMany({ projectId }, { $set: { projectName: projectName, projectStartDate: projectStartDate, projectDueDate: projectDueDate } });

        console.log(updateResult, " i m calling updated result")
        if (updateResult.matchedCount > 0) {
            res.status(200).json({ success: true, data: `${updateResult.matchedCount} tasks updated` });
        } else {
            console.log(`No tasks found for projectId: ${projectId}`);
            res.status(404).json({ success: false, message: `No tasks found for projectId: ${projectId}` });
        }
    } catch (error) {
        console.error('Error updating project details in tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.getTasksByUserAndTime = async (req, res) => {
    const { user } = req.params;

    try {

        const currentTime = new Date();

        const twentyFourHoursLater = new Date(currentTime.getTime() + (24 * 60 * 60 * 1000));

        const query = {
            taskAssignees: { $regex: `(^|,\\s*)${user}(\\s*,|$)` },
            dueDate: { $gte: currentTime, $lte: twentyFourHoursLater }
        };

        const tasks = await Task.find(query).sort({ dueDate: 1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.getAllTask = async (req, res) => {
    const { page, limit, search, projectName, status } = req.query;

    try {


        const query = {};
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        if (search) {
            query.$or = [
                { taskDescription: { $regex: new RegExp(search, 'i') } },
                { taskAssignees: { $regex: new RegExp(search, 'i') } },
            ];
        }

        if (projectName) {
            query.projectName = projectName
        }
        if (status) {
            query.status = status
        }

        const tasks = await Task.paginate(query, { page: parseInt(page), limit: parseInt(limit), sort: { 
            status: 'desc', dueDate: 'asc'
        }  });

        console.log(tasks, "sdnjndsnndsncsdn")

        const groupedTasks = {
            completed: tasks.docs.filter(task => task.status === 'Completed').sort((a, b) => a.dueDate - b.dueDate),
            inProgress: tasks.docs.filter(task => task.status === 'In Progress').sort((a, b) => a.dueDate - b.dueDate),
            pending: tasks.docs.filter(task => task.status === 'Pending').sort((a, b) => a.dueDate - b.dueDate),
            inreview: tasks.docs.filter(task => task.status === 'In Review').sort((a, b) => a.dueDate - b.dueDate),
            failed: tasks.docs.filter(task => task.status === 'Failed').sort((a, b) => a.dueDate - b.dueDate),
        };

        res.status(200).json({
            success: true, data: groupedTasks, totalDocs: tasks.totalDocs,
            limit: tasks.limit,
            totalPages: tasks.totalPages,
            page: tasks.page,
            pagingCounter: tasks.pagingCounter,
            hasPrevPage: tasks.hasPrevPage,
            hasNextPage: tasks.hasNextPage,
            prevPage: tasks.prevPage,
            nextPage: tasks.nextPage
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


