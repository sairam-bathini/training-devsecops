/**
 * VULNERABLE CODE - DO NOT USE IN PRODUCTION
 * Sample vulnerable Node.js/JavaScript code for SAST testing
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');
const eval = require('eval');
const path = require('path');
const fs = require('fs');

const app = express();

// Vulnerability: Hardcoded Credentials (CWE-798)
const DB_HOST = 'localhost';
const DB_USER = 'admin';
const DB_PASSWORD = 'SuperSecret123!';
const API_KEY = 'sk-1234567890abcdefghijklmnop';
const JWT_SECRET = 'mysecretkey123456';

/**
 * Vulnerability: SQL Injection (CWE-89)
 * User input directly concatenated into SQL query
 */
app.get('/api/users/search', (req, res) => {
    const username = req.query.username;
    
    // SQL Injection vulnerability
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

/**
 * Vulnerability: Cross-Site Scripting (XSS) (CWE-79)
 * User input reflected without sanitization
 */
app.get('/api/search-results', (req, res) => {
    const searchTerm = req.query.q;
    
    // Reflected XSS vulnerability
    const html = `
        <html>
            <body>
                <h1>Search Results for: ${searchTerm}</h1>
                <p>Results found...</p>
            </body>
        </html>
    `;
    
    res.send(html);
});

/**
 * Vulnerability: Command Injection (CWE-78)
 * User input passed to shell commands
 */
app.post('/api/execute', (req, res) => {
    const command = req.body.command;
    
    // Command Injection vulnerability
    const child_process = require('child_process');
    child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ output: stdout });
    });
});

/**
 * Vulnerability: Path Traversal (CWE-22)
 * User input used directly in file path
 */
app.get('/api/file', (req, res) => {
    const filename = req.query.filename;
    
    // Path Traversal vulnerability - no validation
    const filePath = path.join(__dirname, '/uploads/', filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ content: data });
    });
});

/**
 * Vulnerability: Insecure Deserialization (CWE-502)
 * Using eval() to deserialize untrusted data
 */
app.post('/api/deserialize', (req, res) => {
    const data = req.body.data;
    
    try {
        // eval() is extremely dangerous
        const obj = eval(`(${data})`);
        res.json({ object: obj });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Vulnerability: Sensitive Data in Logs (CWE-532)
 * Logging sensitive information
 */
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // Logging sensitive data
    console.log(`User login attempt: username=${username}, password=${password}`);
    console.log(`Credentials received: ${username}:${password}`);
    
    // Storing password in memory without hashing
    const user = { username, password };
    res.json({ success: true, user });
});

/**
 * Vulnerability: Sensitive Data Exposure (CWE-200)
 * Returning sensitive data without authorization
 */
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    db.get(query, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Returning all sensitive data
        res.json({
            id: row.id,
            username: row.username,
            email: row.email,
            ssn: row.ssn,
            creditCard: row.credit_card,
            passwordHash: row.password_hash,
            apiKey: row.api_key
        });
    });
});

/**
 * Vulnerability: Unrestricted File Upload (CWE-434)
 * No validation of uploaded files
 */
app.post('/api/upload', (req, res) => {
    const file = req.files.file;
    
    // No file type validation
    const uploadPath = path.join(__dirname, '/uploads/', file.name);
    
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ filename: file.name, path: uploadPath });
    });
});

/**
 * Vulnerability: Weak Cryptography (CWE-327)
 * Using MD5 for password hashing
 */
const crypto = require('crypto');

function hashPassword(password) {
    // MD5 is cryptographically broken
    return crypto.createHash('md5').update(password).digest('hex');
}

/**
 * Vulnerability: Insecure Random (CWE-338)
 * Using Math.random() for security purposes
 */
function generateToken() {
    // Math.random() is not cryptographically secure
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Vulnerability: Cross-Site Request Forgery (CSRF) (CWE-352)
 * No CSRF token validation
 */
app.post('/api/transfer-money', (req, res) => {
    const amount = req.body.amount;
    const recipient = req.body.recipient;
    
    // No CSRF token check - vulnerable to CSRF attacks
    const query = `UPDATE accounts SET balance = balance - ${amount} WHERE user_id = ${req.userId}`;
    
    db.run(query, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

/**
 * Vulnerability: Insecure Direct Object Reference (IDOR) (CWE-639)
 * No authorization check
 */
app.get('/api/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // No check if the user is authorized to view this profile
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    db.get(query, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// Vulnerability: Debug mode enabled
app.use((err, req, res, next) => {
    console.error('Full error details:', err); // Exposes stack trace
    res.status(500).json({
        error: err.message,
        stack: err.stack // Exposes stack trace to client
    });
});

// Database setup
const db = new sqlite3.Database('./vulnerable.db');

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
