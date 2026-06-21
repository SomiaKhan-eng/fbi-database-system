<div align="center">

# FBI Database System

### A role-based case management system modelled on FBI operational structure

![Node.js](https://img.shields.io/badge/Node.js-6E40C9?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-6E40C9?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-6E40C9?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-6E40C9?style=for-the-badge&logo=javascript&logoColor=white)

</div>

---

## About

This project simulates a real-world law enforcement database system. It supports multiple user roles, each with their own dashboard, access level, and responsibilities, reflecting how a real case management system would operate across departments.

The system handles case tracking, criminal records, evidence management, warrant processing, and agent assignments, all through a browser-based interface backed by a relational MySQL database.

---

## User Roles

| Role | Access |
|---|---|
| Admin | Full system access, user management |
| Agent | Case management, criminal records, warrants |
| Analyst | Data analysis, case insights |
| Forensic | Evidence management, forensic reports |

Each role has its own login, registration, and dedicated dashboard.

---

## Features

- Role-based authentication with separate login and dashboards per role
- Case management — create, view, update, and delete case records
- Criminal records — manage criminal profiles, arrests, and dossiers
- Evidence tracking — log, attach files to, and manage case evidence
- Warrant system — issue, view, and revoke warrants
- Agent management — recruit, assign, and discharge agents
- Investigation logs — per-case activity log tied to the logged-in user
- Dashboard stats — live counts of cases, agents, and criminals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML · CSS · JavaScript |
| Backend | Node.js · Express |
| Database | MySQL |

---

## Database

Fully relational MySQL schema covering agents, criminals, cases, evidence, warrants, and users, with foreign key constraints enforcing referential integrity between tables. The complete SQL schema is included in the `/sql` folder.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/SomiaKhan-eng/fbi-database-system.git
cd fbi-database-system

# Install dependencies
cd server
npm install

# Set up your environment variables
cp .env.example .env
# then edit .env with your own MySQL credentials

# Import the database schema
# Run the files in /sql via MySQL Workbench or CLI, in order:
#   1. DBS PROJETC DATABASE.sql
#   2. FBI DATABASE SECOND FILE.sql

# Start the server
node server.js
```

Then open `http://localhost:3000` in your browser.

> Never commit your real `.env` file — it's excluded via `.gitignore`. Use `.env.example` as the template.

---

## Project Structure

```
fbi-database-system/
├── public/
│   ├── index.html              # Landing page
│   ├── dashboard_admin.html    # Admin dashboard
│   ├── dashboard_agent.html    # Agent dashboard
│   ├── dashboard_analyst.html  # Analyst dashboard
│   ├── dashboard_forensic.html # Forensic dashboard
│   ├── cases.html              # Case management
│   ├── criminals.html          # Criminal records
│   ├── evidence.html           # Evidence tracking
│   ├── warrants.html           # Warrant system
│   └── agents.html             # Agent management
├── server/
│   ├── server.js                # Express backend
│   └── .env.example             # Environment variable template
├── sql/
│   ├── DBS PROJETC DATABASE.sql
│   └── FBI DATABASE SECOND FILE.sql
└── .gitignore
```

---

## Known Limitations

This is an academic project, not a production system. A few things worth noting if you build on it:

- Passwords are currently stored and compared in plain text rather than hashed (`bcrypt` is a natural next step here).
- IDs for several tables (criminals, cases, evidence, warrants) are generated manually via `MAX(id) + 1`, which is not safe under concurrent writes — auto-increment columns would be the fix.

---

## Author

**Somia Khan** — [GitHub](https://github.com/SomiaKhan-eng)
