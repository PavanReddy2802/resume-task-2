// knex.js (CORRECTED)

const knexConfig = require('./knexfile'); 

const environment = process.env.NODE_ENV || 'development';

// 1. CRITICAL FIX: Add the afterCreate hook to the configuration object 
//    BEFORE initializing Knex, ONLY if we are using SQLite.
if (environment === 'development' && knexConfig[environment].client === 'sqlite3') {
    knexConfig[environment].connection.afterCreate = (conn, done) => {
        // Run this PRAGMA statement after the connection is established
        conn.run('PRAGMA foreign_keys = ON', done);
    };
}

// 2. Initialize Knex with the (now modified) configuration
const knex = require('knex')(knexConfig[environment]);

module.exports = knex;