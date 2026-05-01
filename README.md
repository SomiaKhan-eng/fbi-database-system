# 🔍 FBI Database System

> A role-based case management database system modelled on FBI operational structure — built with a full web interface and MySQL backend.

---

## 📄 Documentation

Full project documentation including ER diagrams, schema design, system architecture and screenshots is available below.

[📥 View Full Documentation](https://drive.google.com/file/d/1tKG14aSn0avhGzVKV8bti5ydhhNFk-1h/view?usp=sharing)

---

## 💡 About

This project simulates a real-world law enforcement database system. It supports multiple user roles — each with their own dashboard, access level and responsibilities — reflecting how a real case management system would operate across departments.

The system handles case tracking, criminal records, evidence management, warrant processing, and agent assignments — all through a browser-based interface backed by a relational MySQL database.

---

## 👥 User Roles

| Role | Access |
|---|---|
| Admin | Full system access, user management |
| Agent | Case management, criminal records, warrants |
| Analyst | Data analysis, case insights |
| Forensic | Evidence management, forensic reports |

Each role has its own login, registration and dedicated dashboard.

---

## ✨ Features

- **Role-Based Authentication** — separate login and dashboards per role
- **Case Management** — create, view and update case records
- **Criminal Records** — manage criminal profiles and history
- **Evidence Tracking** — log and manage case evidence
- **Warrant System** — issue and track warrants
- **Agent Management** — assign agents to cases
- **Admin Panel** — full system oversight and user control

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML · CSS · JavaScript |
| Backend | Node.js · Express.js |
| Database | MySQL |
| Auth | express-session |

---

## 🗄️ Database

Fully relational MySQL schema covering cases, criminals, agents, evidence, warrants and users — with role-based access control enforced at both the UI and server level.

The complete SQL schema is included in the `/sql` folder.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/SomiaKhan-eng/fbi-database-system.git

# Navigate to server
cd fbi-database-system/server

# Install dependencies
npm install

# Import the database schema
# Run the SQL file in /sql folder via MySQL Workbench or CLI

# Set up your .env file with:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# Start the server
node server.js
```

Then open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

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
│   └── server.js               # Express backend
├── sql/
│   └── DBS PROJECT DATABASE.sql
└── Database System Project Documentation.pdf
```

---

## 🚧 Status

Most core features are working. Some refinements ongoing.

---

## 👩‍💻 Author

**Somia Khan** — [GitHub](https://github.com/SomiaKhan-eng)
