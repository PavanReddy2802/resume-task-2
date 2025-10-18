// routes/authRouter.js (UPDATED for In-Memory Store)

const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const mockDb = require('../db'); // NEW: Use mock database

//const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_internship_key'; 
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_key_for_local_testing_only';
// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  // Check if user exists
  if (mockDb.users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Registration failed: That email is already in use.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = mockDb.nextUserId++;

    const newUser = { id, email, password: hashedPassword, first_name, last_name };
    mockDb.users.push(newUser); // Insert into mock database
    
    res.status(201).json({ message: 'User registered successfully!', id });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Registration failed due to server error.' });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for login.' });
    }

    try {
        const user = mockDb.users.find(u => u.email === email); // Find in mock database

        if (!user) return res.status(401).json({ message: 'Invalid Credentials.' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid Credentials.' });
        
        const tokenPayload = { userId: user.id, email: user.email };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token, userId: user.id });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Login failed due to server error.' });
    }
});

module.exports = router;