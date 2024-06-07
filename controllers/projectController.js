const Project = require('../models/project'); 
const ArchiveProject = require("../models/archiveProject")
const Task = require('../models/task');


module.exports.createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getAllProjects = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { projectName: { $regex: new RegExp(search, 'i') } },
                { projectDescription: { $regex: new RegExp(search, 'i') } },
                { projectReference: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const projects = await Project.paginate(query, options);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
        await Task.updateMany({ projectId: id }, { projectName: projectName });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await Project.findById(id);

        if (deletedProject) {
            const archiveProject = new ArchiveProject(deletedProject.toObject());
            await archiveProject.save();
        }

        await Project.findByIdAndDelete(id);

        await Task.deleteMany({ projectId: id });


        console.log("Deleted successfully");
        res.status(201).send({ data: deletedProject });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    
};

module.exports.getAllProjectName = async (req, res) => {
    try {

        const projects = await Project.find({});
        const projectNames = projects.map(project => project.projectName);
        projectNames.sort((a, b) => {
                return a.localeCompare(b.name);
              });
        res.status(200).json(projectNames);
    } catch (error) {
        console.error('Error fetching projects names:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

