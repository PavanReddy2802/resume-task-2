// routes/userRouter.js (FINAL CORRECTED VERSION)

const router = require('express').Router();
const restricted = require('../middleware/authMiddleware'); 
// NOTE: Using the mockDb for the in-memory prototype
const mockDb = require('../db'); 
// Removed const db = require('../knex');

// GET /api/user/profile - REQUIRES JWT (Protected Route)
router.get('/profile', restricted, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Use mockDb to find the user
        const user = mockDb.users.find(u => u.id === userId); 

        if (user) {
            // Only return non-sensitive data, even from the mock store
            const { password, ...safeUser } = user;

            res.status(200).json({ 
                message: 'Access granted!',
                profile: safeUser,
                source: 'This data was fetched using your valid JWT.'
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: 'Failed to retrieve profile.' });
    }
});

// GET /api/user/summary - REQUIRES JWT (Protected Route)
router.get('/summary', restricted, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Fetch all resume components for the user from the mock database
        const user = mockDb.users.find(u => u.id === userId);
        const projects = mockDb.projects.filter(p => p.user_id === userId);
        const courses = mockDb.courses.filter(c => c.user_id === userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // --- AI/AUTOMATION LOGIC ---
        
        // Define default names if arrays are empty (Fix for potential crashes)
        const firstCourseName = courses.length > 0 ? courses[0].course_name : 'various technical training';
        const firstProjectName = projects.length > 0 ? projects[0].project_name : 'core system development';
        
        const summary = [
            `Highly motivated professional, ${user.first_name} ${user.last_name}, specializing in Backend Development.`,
            `Successfully completed ${courses.length} verified course(s), including "${firstCourseName}."`,
            `Key experience demonstrated through ${projects.length} project(s), such as the "${firstProjectName}", showcasing hands-on skills.`
        ].join(' ');

        res.status(200).json({
            message: 'Resume summary auto-generated successfully.',
            generated_summary: summary,
            data_source: {
                projects: projects.length,
                courses: courses.length
            }
        });
    } catch (error) {
        console.error("Summary Generation Error:", error);
        res.status(500).json({ message: 'Failed to generate summary.' });
    }
});

module.exports = router;