const Project = require('../models/Project');

const editableFields = [
  'title',
  'location',
  'category',
  'finish',
  'squareMeters',
  'duration',
  'imageBefore',
  'imageAfter',
  'description',
  'clientCompany',
  'testimonial',
  'clientName'
];

const getProjectFilter = (id) => ({
  $or: [
    { id },
    ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])
  ]
});

const getEditableProject = (body) => editableFields.reduce((project, field) => {
  if (body[field] !== undefined) {
    project[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
  }
  return project;
}, {});

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne(getProjectFilter(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/projects (Admin)
exports.addProject = async (req, res) => {
  try {
    const projectData = getEditableProject(req.body);
    if (!projectData.title) {
      return res.status(400).json({ error: 'Project title is required.' });
    }
    const project = await Project.create(projectData);
    return res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Failed to create project:', error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

// PUT /api/projects/:id (Admin)
exports.updateProject = async (req, res) => {
  try {
    const projectData = getEditableProject(req.body);
    if ('title' in projectData && !projectData.title) {
      return res.status(400).json({ error: 'Project title is required.' });
    }
    const project = await Project.findOneAndUpdate(
      getProjectFilter(req.params.id),
      projectData,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ success: true, project });
  } catch (error) {
    console.error('Failed to update project:', error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

// DELETE /api/projects/:id (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete(getProjectFilter(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return res.status(500).json({ error: error.message });
  }
};
