
// routes/projectRouter.js

const router = require('express').Router();
const mockDb = require('../db'); // Use mock database
const restricted = require('../middleware/authMiddleware'); 

// All routes are protected by the JWT middleware
router.use(restricted); 

// POST /api/projects - Add a new project
router.post('/', async (req, res) => {
    const projectData = req.body;
    const userId = req.user.userId;

    if (!projectData.project_name || !projectData.description) {
        return res.status(400).json({ message: 'Project name and description are required.' });
    }

    try {
        const id = mockDb.nextProjectId++;
        const newProject = {
            id,
            ...projectData,
            user_id: userId
        };
        mockDb.projects.push(newProject); // Insert into mock database

        res.status(201).json({ 
            message: 'Project added successfully!', 
            project: newProject
        });
    } catch (error) {
        console.error("Add Project Error:", error);
        res.status(500).json({ message: 'Failed to add project.' });
    }
});

// GET /api/projects - Get all projects for the authenticated user
router.get('/', async (req, res) => {
    const userId = req.user.userId;

    try {
        // Filter array by user_id
        const projects = mockDb.projects.filter(p => p.user_id === userId);

        res.status(200).json(projects);
    } catch (error) {
        console.error("Get Projects Error:", error);
        res.status(500).json({ message: 'Failed to retrieve projects.' });
    }
});

module.exports = router;