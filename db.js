// db.js (In-Memory Mock Database)

// Initialize mock tables
let users = [];
let courses = [];
let projects = [];

// Simulate auto-incrementing IDs
let nextUserId = 1;
let nextCourseId = 1;
let nextProjectId = 1;

// Function to reset the database for testing purposes
const reset = () => {
    users = [];
    courses = [];
    projects = [];
    nextUserId = 1;
    nextCourseId = 1;
    nextProjectId = 1;
}

module.exports = {
    users,
    courses,
    projects,
    nextUserId,
    nextCourseId,
    nextProjectId,
    reset
};