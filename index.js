const express = require('express');
const authRouter = require('./routes/authRouter'); 
const userRouter = require('./routes/userRouter'); 
const courseRouter = require('./routes/courseRouter'); 
const mockDb = require('./db'); // NEW: Import the mock database
const projectRouter = require('./routes/projectRouter');

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. PUBLIC ROUTES

// Root Test Route
// index.js (Corrected GET / Route)

// index.js (Final and Enhanced Readable GET / Route)

// index.js (Final Array-Based GET / Route for Clarity)

app.get('/', (req, res) => {
    res.json({
        "status": "Welcome to the Resume System Backend API Prototype",
        "message": "This is a working prototype for the internship trial task. Please use Postman or cURL to verify the functionality.",
        "documentation": "Full instructions and testing sequence are available in the GitHub README.",
        
        "endpoints_summary": [
            "--- START TESTING SEQUENCE ---",
            "1. AUTHENTICATION: POST /api/auth/register, POST /api/auth/login",
            "2. SECURITY CHECK: GET /api/user/profile (Test with and without JWT in Authorization header)",
            "3. DATA MANAGEMENT: POST/GET /api/courses and POST/GET /api/projects",
            "4. AUTOMATION: GET /api/user/summary (Generates final resume summary)",
            "5. RESET: POST /reset-db (Always run this first to clear data)"
        ],
        
        "note": "The project source code is available on GitHub."
    });
});

// New Route: Reset the mock database for clean testing
app.post('/reset-db', (req, res) => {
    mockDb.reset();
    res.status(200).json({ message: 'Mock database reset successfully.' });
});

// 2. API ROUTES INTEGRATION

// Public Auth Routes
app.use('/api/auth', authRouter); 
// Protected User Routes
app.use('/api/user', userRouter); 
// Protected Course Routes
app.use('/api/courses', courseRouter); 
app.use('/api/projects', projectRouter);


// 3 cross platform integration

// Define a secret key that the external platform would use to authenticate itself.
const INTEGRATION_SECRET = 'hackathon-platform-verified-key'; 

// POST /api/verify/achievement - Public but requires a secret header
app.post('/api/verify/achievement', (req, res) => {
    const secretKey = req.headers['x-api-key']; // Custom header for external auth
    const { userId, title, date, source } = req.body;

    if (secretKey !== INTEGRATION_SECRET) {
        return res.status(403).json({ message: 'Invalid X-API-Key. Integration denied.' });
    }
    
    // In a real system, we would have an 'achievements' table/array here.
    // For the prototype, we just verify the data structure and log success.
    if (!userId || !title || !date) {
        return res.status(400).json({ message: 'Missing achievement data.' });
    }

    // In-memory logic to simulate adding to achievements
    const newAchievement = {
        id: mockDb.nextCourseId++, // Re-using counter for simplicity
        user_id: userId,
        title: title,
        date: date,
        source: source || 'External Integration'
    };
    mockDb.courses.push(newAchievement); // Use courses array as a proxy for achievements

    res.status(200).json({ 
        message: 'Verified achievement received and recorded.', 
        data: newAchievement 
    });
});
// ----------------------------------------------------------------------
// 3. SERVER START
// ----------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});