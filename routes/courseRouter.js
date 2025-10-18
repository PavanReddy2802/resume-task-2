// routes/courseRouter.js (UPDATED for In-Memory Store)

const router = require('express').Router();
const mockDb = require('../db'); // NEW: Use mock database
const restricted = require('../middleware/authMiddleware'); 

router.use(restricted); 

// POST /api/courses - Add a new course
router.post('/', async (req, res) => {
    const courseData = req.body;
    const userId = req.user.userId;

    if (!courseData.course_name) {
        return res.status(400).json({ message: 'Course name is required.' });
    }

    try {
        const id = mockDb.nextCourseId++;
        const newCourse = {
            id,
            ...courseData,
            user_id: userId
        };
        mockDb.courses.push(newCourse); // Insert into mock database

        res.status(201).json({ 
            message: 'Course added successfully!', 
            course: newCourse
        });
    } catch (error) {
        console.error("Add Course Error:", error);
        res.status(500).json({ message: 'Failed to add course.' });
    }
});

// GET /api/courses - Get all courses for the authenticated user
router.get('/', async (req, res) => {
    const userId = req.user.userId;

    try {
        // Filter array by user_id
        const courses = mockDb.courses.filter(c => c.user_id === userId);

        res.status(200).json(courses);
    } catch (error) {
        console.error("Get Courses Error:", error);
        res.status(500).json({ message: 'Failed to retrieve courses.' });
    }
});

module.exports = router;