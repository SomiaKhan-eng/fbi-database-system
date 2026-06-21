require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// 2. Tell the server to look ONE LEVEL UP (..) into the 'PUBLIC' folder
// Note: We use 'PUBLIC' because your folder name is in ALL CAPS in your files.
app.use(express.static(path.join(__dirname, '..', 'public')));

// 3. Explicitly serve the index.html for the home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'fbi_criminal_db'
});

// Test the connection
db.connect((err) => {
    if (err) {
        console.error('❌ Oh no! Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to FBI Database successfully!');
    }
});

// --- BASIC TEST ROUTE ---
// This lets us check if the server is working in the browser

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
// --- DASHBOARD API: Get the stats ---
app.get('/api/stats', (req, res) => {
    const queries = {
        cases: "SELECT COUNT(*) AS count FROM CASES",
        agents: "SELECT COUNT(*) AS count FROM FBI_AGENT",
        criminals: "SELECT COUNT(*) AS count FROM CRIMINAL",
        recent: "SELECT title, status FROM CASES ORDER BY opening_date DESC LIMIT 5"
    };

    // We run multiple queries to get all the numbers
    db.query(queries.cases, (err, caseRes) => {
        db.query(queries.agents, (err, agentRes) => {
            db.query(queries.criminals, (err, crimRes) => {
                db.query(queries.recent, (err, recentRes) => {
                    res.json({
                        total_cases: caseRes[0].count,
                        total_agents: agentRes[0].count,
                        total_criminals: crimRes[0].count,
                        recent_cases: recentRes
                    });
                });
            });
        });
    });
});
// 1. Tell the server to share files from the 'public' folder
// --- REGISTRATION ROUTE ---
// --- UPDATED REGISTER ROUTE (Saves the Role!) ---
// --- AUTOMATIC REGISTRATION (Saves the Role!) ---
// --- REGISTRATION ROUTE (Now Supports Auto-ID) ---
app.post('/register', (req, res) => {
    const { full_name, role, username, password } = req.body;

    console.log("📝 Registering:", username, "| Role:", role);

    // 1. Check if Username Exists
    db.query("SELECT * FROM USERS WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.error("❌ DB Check Error:", err);
            return res.json({ success: false, message: "Database Error" });
        }
        
        if (result.length > 0) {
            return res.json({ success: false, message: "Username already taken!" });
        }

        // 2. INSERT NEW USER
        // Note: We DO NOT insert 'user_id'. The database does that automatically now!
        const sql = "INSERT INTO USERS (full_name, role, username, password, status, last_login) VALUES (?, ?, ?, ?, 'Active', NOW())";
        
        db.query(sql, [full_name, role, username, password], (insertErr) => {
            if (insertErr) {
                console.error("❌ Insert Error:", insertErr); // This will print in terminal if it fails
                return res.json({ success: false, message: "Registration Failed: " + insertErr.sqlMessage });
            }
            
            console.log("✅ Success! Registered:", username);
            res.json({ success: true, message: "Registration Successful!" });
        });
    });
});
// 2. The Login Route (The Brains)
// --- UPDATED LOGIN ROUTE WITH ACCESS LOG ---
// --- SAFER LOGIN ROUTE (Won't Crash) ---
// --- FINAL CORRECTED LOGIN ROUTE (Matches Your Table) ---
// --- LOGIN ROUTE WITH ROLE VERIFICATION ---
// --- DEBUG LOGIN ROUTE (Tells us the secret) ---
// --- LOGIN ROUTE (For Normalized Database) ---
// --- SIMPLE & ROBUST LOGIN ROUTE ---
app.post('/login', (req, res) => {
    const { username, password, selectedRole } = req.body;

    // NO MORE JOINS! Just select straight from USERS table.
    const sql = "SELECT * FROM USERS WHERE username = ? AND password = ? AND status = 'Active'";
    
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: 'Database Error' });
        } else if (results.length > 0) {
            const user = results[0];

            // 🛑 SECURITY CHECK
            // We compare user.role (from DB) with selectedRole (from Dropdown)
            
            // Debug print to help us see
            console.log(`Login Attempt: ${username} | DB Role: ${user.role} | Selected: ${selectedRole}`);

            if (user.role !== selectedRole) {
                return res.json({ success: false, message: 'Role Mismatch: You are registered as ' + user.role });
            }

            // ✅ SUCCESS
            // We still log it, because that's professional
            const logSql = "INSERT INTO ACCESS_LOG (user_id, login_time, ip_address) VALUES (?, NOW(), ?)";
            db.query(logSql, [user.user_id, '127.0.0.1'], () => {
                res.json({ 
                    success: true, 
                    message: 'Welcome ' + user.username,
                    role: user.role,
                    username: user.username 
                });
            });

        } else {
            res.json({ success: false, message: 'Invalid Credentials' });
        }
    });
});
// --- GET ALL AGENTS API ---
app.get('/api/agents', (req, res) => {
    const sql = "SELECT * FROM FBI_AGENT";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            res.status(500).json({ success: false, message: "Database error" });
        } else {
            res.json(results); // This sends the agent list back to the HTML
        }
    });
});
// --- ADD NEW AGENT ---
app.post('/api/agents', (req, res) => {
    const { first_name, last_name, dob, agent_rank, badge_no, department_name } = req.body;
    const sql = "INSERT INTO FBI_AGENT (first_name, last_name, dob, agent_rank, badge_no, department_name) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [first_name, last_name, dob, agent_rank, badge_no, department_name], (err, result) => {
        if (err) return res.json({ success: false, message: err.message });
        res.json({ success: true, message: "Agent Recruited!" });
    });
});

// --- DELETE AGENT ---
// --- DELETE AGENT API ---
app.delete('/api/agents/:id', (req, res) => {
    const agentId = req.params.id;

    // 1. Unassign Agent from CASES (Keep the case, just remove the agent)
    db.query("UPDATE CASES SET agent_id = NULL WHERE agent_id = ?", [agentId], () => {
        
        // 2. Unassign Agent from EVIDENCE
        db.query("UPDATE EVIDENCE SET agent_id = NULL WHERE agent_id = ?", [agentId], () => {

            // 3. Delete Agent's Phone Numbers
            db.query("DELETE FROM AGENT_PHONE WHERE agent_id = ?", [agentId], () => {

                // 4. Finally, Delete the Agent
                db.query("DELETE FROM FBI_AGENT WHERE agent_id = ?", [agentId], (err, result) => {
                    if (err) {
                        res.json({ success: false, message: "Error deleting agent: " + err.message });
                    } else {
                        res.json({ success: true, message: "Agent Discharged Successfully" });
                    }
                });
            });
        });
    });
});
// --- CASES API: Get All Cases ---
app.get('/api/cases', (req, res) => {
    // We join with the AGENT table so we can show the Agent's name instead of just their ID
    const sql = `
        SELECT c.*, a.first_name, a.last_name 
        FROM CASES c 
        LEFT JOIN FBI_AGENT a ON c.agent_id = a.agent_id
        ORDER BY c.opening_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) res.json({ error: "DB Error" });
        else res.json(results);
    });
});

// --- CASES API: Add New Case ---
app.post('/api/cases/add', (req, res) => {
    const { title, status, priority, description, crime_type_id, agent_id } = req.body;
    
    // 1. Generate a new Case ID (Find max + 1)
    db.query("SELECT MAX(case_id) as maxId FROM CASES", (err, result) => {
        const newId = (result[0].maxId || 200) + 1; // Default to 201 if empty

        // 2. Insert the case
        const sql = "INSERT INTO CASES (case_id, title, status, opening_date, priority_level, description, crime_type_id, agent_id) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)";
        
        db.query(sql, [newId, title, status, priority, description, crime_type_id, agent_id], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ success: false, message: "Failed to create case" });
            } else {
                res.json({ success: true, message: "Case Filed Successfully!" });
            }
        });
    });
});
// --- CRIMINALS API: Get All Criminals ---
app.get('/api/criminals', (req, res) => {
    // We select specific columns to show in the list
    const sql = "SELECT * FROM CRIMINAL ORDER BY criminal_id DESC";
    db.query(sql, (err, results) => {
        if (err) res.json({ error: "DB Error" });
        else res.json(results);
    });
});

// --- CRIMINALS API: Add New Criminal ---
app.post('/api/criminals/add', (req, res) => {
    // These variables match your SQL columns EXACTLY
    const { 
        first_name, last_name, dob, gender, nationality, 
        address_street, address_city, address_state, national_id 
    } = req.body;
    
    // 1. Generate new Criminal ID (Manual ID system as per your DB)
    db.query("SELECT MAX(criminal_id) as maxId FROM CRIMINAL", (err, result) => {
        const newId = (result[0].maxId || 100) + 1; // Start at 101 if empty

        // 2. Insert into CRIMINAL table
        const sql = `INSERT INTO CRIMINAL 
        (criminal_id, first_name, last_name, dob, gender, nationality, address_street, address_city, address_state, national_identification_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [newId, first_name, last_name, dob, gender, nationality, address_street, address_city, address_state, national_id], (err, result) => {
            if (err) {
                console.error(err); // Check terminal if error happens!
                if(err.code === 'ER_DUP_ENTRY') {
                    res.json({ success: false, message: "National ID already exists!" });
                } else {
                    res.json({ success: false, message: "Database Error" });
                }
            } else {
                res.json({ success: true, message: "Criminal Record Created!" });
            }
        });
    });
});
// --- EVIDENCE API: Get All Evidence ---
app.get('/api/evidence', (req, res) => {
    // We join with CASES so we can see the Case Title, not just the ID
    const sql = `
        SELECT e.*, c.title as case_title 
        FROM EVIDENCE e
        JOIN CASES c ON e.case_id = c.case_id
        ORDER BY e.collection_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) res.json({ error: "DB Error" });
        else res.json(results);
    });
});

// --- EVIDENCE API: Log New Evidence ---
app.post('/api/evidence/add', (req, res) => {
    const { case_id, agent_id, evidence_type, description, collection_date } = req.body;
    
    // 1. Generate ID (Max + 1)
    db.query("SELECT MAX(evidence_id) as maxId FROM EVIDENCE", (err, result) => {
        const newId = (result[0].maxId || 400) + 1; // Start at 401

        // 2. Insert
        const sql = "INSERT INTO EVIDENCE (evidence_id, case_id, agent_id, evidence_type, description, collection_date) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(sql, [newId, case_id, agent_id, evidence_type, description, collection_date], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ success: false, message: "Failed (Check Case ID or Agent ID)" });
            } else {
                res.json({ success: true, message: "Evidence Logged!" });
            }
        });
    });
});
// --- INVESTIGATION LOGS API ---

// 1. Get Logs for a specific Case
app.get('/api/logs/:caseId', (req, res) => {
    const caseId = req.params.caseId;
    // Join with USERS to see WHO wrote the log
    const sql = `
        SELECT l.*, u.username 
        FROM INVESTIGATION_LOG l
        JOIN USERS u ON l.user_id = u.user_id
        WHERE l.case_id = ?
        ORDER BY l.timestamp DESC
    `;
    db.query(sql, [caseId], (err, results) => {
        if (err) res.json({ error: "DB Error" });
        else res.json(results);
    });
});

// 2. Add a New Log Entry
app.post('/api/logs/add', (req, res) => {
    const { case_id, user_id, description } = req.body;
    
    // Generate Log ID
    db.query("SELECT MAX(log_id) as maxId FROM INVESTIGATION_LOG", (err, result) => {
        const newId = (result[0].maxId || 0) + 1;
        const sql = "INSERT INTO INVESTIGATION_LOG (log_id, case_id, user_id, description, timestamp) VALUES (?, ?, ?, ?, NOW())";
        
        db.query(sql, [newId, case_id, user_id, description], (err, result) => {
            if (err) res.json({ success: false });
            else res.json({ success: true });
        });
    });
});
// --- DELETE EVIDENCE API ---
app.delete('/api/evidence/:id', (req, res) => {
    const evidenceId = req.params.id;

    // 1. Delete attached files (EVIDENCE_FILE)
    db.query("DELETE FROM EVIDENCE_FILE WHERE evidence_id = ?", [evidenceId], () => {

        // 2. Delete forensic reports (EVIDENCE_REPORT)
        db.query("DELETE FROM EVIDENCE_REPORT WHERE evidence_id = ?", [evidenceId], () => {

            // 3. Delete the Evidence Record
            db.query("DELETE FROM EVIDENCE WHERE evidence_id = ?", [evidenceId], (err, result) => {
                if (err) {
                    res.json({ success: false, message: "Error: " + err.message });
                } else {
                    res.json({ success: true, message: "Evidence Deleted" });
                }
            });
        });
    });
});
// --- CRIMINAL DOSSIER API ---
// --- DEBUG VERSION: ADD CRIMINAL ---
// --- FIX: ADD CRIMINAL (Matching Your Exact Schema) ---
app.post('/api/criminals/add', (req, res) => {
    console.log("📥 Receiving Suspect Data...", req.body);

    // 1. Get data from Frontend (Note: 'national_id' comes from the form)
    const { 
        first_name, last_name, dob, gender, nationality, 
        address_street, address_city, address_state, national_id 
    } = req.body;

    // 2. Validation: Ensure required fields are there
    if (!first_name || !last_name || !national_id || !dob) {
        console.log("❌ Error: Missing required fields!");
        return res.json({ success: false, message: "Missing Name, CNIC, or Date of Birth" });
    }

    // 3. Generate New ID
    db.query("SELECT MAX(criminal_id) as maxId FROM CRIMINAL", (err, result) => {
        if (err) {
            console.error("❌ DB ID Error:", err);
            return res.json({ success: false, message: "Database Error" });
        }

        const newId = (result[0].maxId || 100) + 1;
        console.log("🔢 Generated ID:", newId);

        // 4. INSERT QUERY (Matches your schema EXACTLY)
        const sql = `INSERT INTO CRIMINAL 
        (criminal_id, first_name, last_name, dob, gender, nationality, address_street, address_city, address_state, national_identification_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Note: We map 'national_id' (from form) to the last ? (national_identification_number)
        const values = [newId, first_name, last_name, dob, gender, nationality, address_street, address_city, address_state, national_id];

        db.query(sql, values, (insertErr, insertRes) => {
            if (insertErr) {
                console.error("❌ INSERT FAILED:", insertErr.sqlMessage); // Look at terminal for this!
                
                if (insertErr.code === 'ER_DUP_ENTRY') {
                    res.json({ success: false, message: "This CNIC already exists in the system!" });
                } else if (insertErr.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
                    res.json({ success: false, message: "Gender must be 'Male', 'Female', or 'Other'" });
                } else {
                    res.json({ success: false, message: "Database Error: " + insertErr.sqlMessage });
                }
            } else {
                console.log("✅ SUCCESS: Suspect Added!");
                res.json({ success: true, message: "Criminal Record Created!" });
            }
        });
    });
});
// --- ADD ARREST RECORD API ---
app.post('/api/arrests/add', (req, res) => {
    const { criminal_id, arrest_date, arrest_location, arrest_status } = req.body;
    
    db.query("SELECT MAX(arrest_id) as maxId FROM ARREST_RECORD", (err, result) => {
        const newId = (result[0].maxId || 300) + 1;
        const sql = "INSERT INTO ARREST_RECORD VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [newId, criminal_id, arrest_date, arrest_location, arrest_status], (err) => {
            if (err) res.json({ success: false, message: err.message });
            else res.json({ success: true });
        });
    });
});

// --- ADD PHOTO (URL) API ---
// Since we are keeping it simple without file upload logic, we will just save the 'path' string
app.post('/api/photos/add', (req, res) => {
    const { criminal_id, photo_path } = req.body;
    const sql = "INSERT INTO CRIMINAL_PHOTO (criminal_id, photo_path) VALUES (?, ?)";
    db.query(sql, [criminal_id, photo_path], (err) => {
        if (err) res.json({ success: false });
        else res.json({ success: true });
    });
});
// --- WARRANTS API ---
app.get('/api/warrants', (req, res) => {
    const sql = "SELECT * FROM WARRANT ORDER BY issue_date DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err); // Prints error to terminal
            res.json({ error: "DB Error" });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/warrants/add', (req, res) => {
    const { warrant_type, issue_date, expiry_date, issued_by } = req.body;
    
    db.query("SELECT MAX(warrant_id) as maxId FROM WARRANT", (err, result) => {
        const newId = (result[0].maxId || 500) + 1;
        const sql = "INSERT INTO WARRANT (warrant_id, warrant_type, issue_date, expiry_date, issued_by) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [newId, warrant_type, issue_date, expiry_date, issued_by], (err) => {
            if (err) res.json({ success: false, message: err.message });
            else res.json({ success: true });
        });
    });
});
// --- DELETE WARRANT API ---
app.delete('/api/warrants/:id', (req, res) => {
    const warrantId = req.params.id;

    db.query("DELETE FROM WARRANT WHERE warrant_id = ?", [warrantId], (err, result) => {
        if (err) {
            res.json({ success: false, message: "Error: " + err.message });
        } else {
            res.json({ success: true, message: "Warrant Deleted" });
        }
    });
});
// --- AGENTS API ---
app.get('/api/agents', (req, res) => {
    // We select agents and join with USERS to get their login status if possible, 
    // but let's keep it simple and just show the Agent Table details.
    const sql = "SELECT * FROM FBI_AGENT ORDER BY agent_id ASC";
    db.query(sql, (err, results) => {
        if (err) res.json({ error: "DB Error" });
        else res.json(results);
    });
});
// --- DELETE CASE API ---
app.delete('/api/cases/:id', (req, res) => {
    const caseId = req.params.id;
    
    // First, delete logs related to this case (Foreign Key safety!)
    db.query("DELETE FROM INVESTIGATION_LOG WHERE case_id = ?", [caseId], () => {
        // Then delete evidence related to this case
        db.query("DELETE FROM EVIDENCE WHERE case_id = ?", [caseId], () => {
            // Finally, delete the case itself
            db.query("DELETE FROM CASES WHERE case_id = ?", [caseId], (err, result) => {
                if (err) {
                    res.json({ success: false, message: "DB Error" });
                } else {
                    res.json({ success: true, message: "Case Deleted" });
                }
            });
        });
    });
});

// --- DELETE CRIMINAL API ---
app.delete('/api/criminals/:id', (req, res) => {
    const criminalId = req.params.id;

    // 1. Delete Arrest Records
    db.query("DELETE FROM ARREST_RECORD WHERE criminal_id = ?", [criminalId], () => {

        // 2. Delete Contact Info
        db.query("DELETE FROM CRIMINAL_CONTACT WHERE criminal_id = ?", [criminalId], () => {

            // 3. Delete Mugshots
            db.query("DELETE FROM CRIMINAL_PHOTO WHERE criminal_id = ?", [criminalId], () => {

                // 4. Unlink from Cases (Remove from CRIMINAL_CASE table)
                db.query("DELETE FROM CRIMINAL_CASE WHERE criminal_id = ?", [criminalId], () => {

                    // 5. Finally, Delete the Criminal Profile
                    db.query("DELETE FROM CRIMINAL WHERE criminal_id = ?", [criminalId], (err, result) => {
                        if (err) {
                            res.json({ success: false, message: "Error: " + err.message });
                        } else {
                            res.json({ success: true, message: "Criminal Record Deleted" });
                        }
                    });
                });
            });
        });
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});