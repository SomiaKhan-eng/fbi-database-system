CREATE DATABASE fbi_criminal_db;
USE fbi_criminal_db;

CREATE TABLE FBI_AGENT (
    agent_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    agent_rank VARCHAR(50) CHECK (agent_rank IN ('Junior', 'Senior', 'Inspector', 'Director')),
    badge_no VARCHAR(30) UNIQUE,
    department_name VARCHAR(100)
);

CREATE TABLE AGENT_PHONE (
    phone_id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT,
    phone_no VARCHAR(20) CHECK (phone_no REGEXP '^[0-9+]{10,15}$'),
    FOREIGN KEY (agent_id) REFERENCES FBI_AGENT(agent_id)
);

CREATE TABLE CRIMINAL (
    criminal_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    nationality VARCHAR(50),
    address_street VARCHAR(100),
    address_city VARCHAR(50),
    address_state VARCHAR(50),
    national_identification_number VARCHAR(50) UNIQUE
);

CREATE TABLE CRIMINAL_CONTACT (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    criminal_id INT,
    contact_info VARCHAR(100),
    FOREIGN KEY (criminal_id) REFERENCES CRIMINAL(criminal_id)
);

CREATE TABLE CRIMINAL_PHOTO (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    criminal_id INT,
    photo_path VARCHAR(255),
    FOREIGN KEY (criminal_id) REFERENCES CRIMINAL(criminal_id)
);

CREATE TABLE CRIME_TYPE (
    crime_type_id INT PRIMARY KEY,
    crime_name VARCHAR(100),
    description TEXT,
    severity_level VARCHAR(50) CHECK (severity_level IN ('Low', 'Medium', 'High', 'Critical')),
    penal_code_reference VARCHAR(50)
);

CREATE TABLE CASES (
    case_id INT PRIMARY KEY,
    title VARCHAR(150),
    status VARCHAR(50) CHECK (status IN ('Open', 'Closed', 'Under Investigation')),
    opening_date DATE,
    priority_level VARCHAR(50) CHECK (priority_level IN ('Low', 'Medium', 'High')),
    description TEXT,
    crime_type_id INT,
    agent_id INT,
    FOREIGN KEY (crime_type_id) REFERENCES CRIME_TYPE(crime_type_id),
    FOREIGN KEY (agent_id) REFERENCES FBI_AGENT(agent_id)
);

CREATE TABLE ARREST_RECORD (
    arrest_id INT PRIMARY KEY,
    criminal_id INT,
    arrest_date DATE,
    arrest_location VARCHAR(100),
    arrest_status VARCHAR(50) CHECK (arrest_status IN ('Arrested', 'Released', 'Transferred')),
    FOREIGN KEY (criminal_id) REFERENCES CRIMINAL(criminal_id)
);

CREATE TABLE WARRANT (
    warrant_id INT PRIMARY KEY,
    warrant_type VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
    issued_by VARCHAR(100)
);

CREATE TABLE USERS (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    last_login DATETIME
);

CREATE TABLE ROLE (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(50)
);

CREATE TABLE USER_ROLE (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (role_id) REFERENCES ROLE(role_id)
);

CREATE TABLE ACCESS_LOG (
    access_log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    login_time DATETIME,
    logout_time DATETIME,
    ip_address VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE TABLE EVIDENCE (
    evidence_id INT PRIMARY KEY,
    case_id INT,
    agent_id INT,
    evidence_type VARCHAR(100) CHECK (evidence_type IN ('Physical', 'Digital', 'Biological', 'Document')),
    description TEXT,
    collection_date DATE,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id),
    FOREIGN KEY (agent_id) REFERENCES FBI_AGENT(agent_id)
);

CREATE TABLE EVIDENCE_FILE (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    evidence_id INT,
    file_path VARCHAR(255),
    FOREIGN KEY (evidence_id) REFERENCES EVIDENCE(evidence_id)
);

CREATE TABLE INVESTIGATION_LOG (
    log_id INT PRIMARY KEY,
    case_id INT,
    user_id INT,
    description TEXT,
    timestamp DATETIME,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE TABLE EVIDENCE_REPORT (
    report_no INT PRIMARY KEY,
    evidence_id INT,
    forensic_result TEXT,
    report_date DATE,
    FOREIGN KEY (evidence_id) REFERENCES EVIDENCE(evidence_id)
);

CREATE TABLE CRIMINAL_CASE (
    criminal_id INT,
    case_id INT,
    PRIMARY KEY (criminal_id, case_id),
    FOREIGN KEY (criminal_id) REFERENCES CRIMINAL(criminal_id),
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);
INSERT INTO FBI_AGENT 
VALUES
(1, 'Ali', 'Khan', '1985-06-10', 'Inspector', 'FBI001', 'Cyber Division'),
(2, 'Sara', 'Ahmed', '1990-03-15', 'Senior', 'FBI002', 'Homicide Division'),
(3, 'Usman', 'Raza', '1982-11-22', 'Junior', 'FBI003', 'Narcotics Division');
INSERT INTO CRIME_TYPE 
VALUES
(1, 'Cyber Crime', 'Online fraud and hacking', 'High', 'PC-420'),
(2, 'Homicide', 'Intentional killing', 'Critical', 'PC-302'),
(3, 'Drug Trafficking', 'Illegal drug distribution', 'High', 'PC-9');
INSERT INTO CRIMINAL 
VALUES
(101, 'Ahsan', 'Malik', '1992-04-18', 'Male', 'Pakistani', 'Street 1', 'Lahore', 'Punjab', 'CNIC-12345'),
(102, 'Fatima', 'Noor', '1995-08-25', 'Female', 'Pakistani', 'Street 7', 'Karachi', 'Sindh', 'CNIC-67890'),
(103, 'Bilal', 'Qureshi', '1988-12-05', 'Male', 'Pakistani', 'Street 9', 'Islamabad', 'ICT', 'CNIC-54321');
INSERT INTO CASES 
VALUES
(201, 'Online Banking Fraud', 'Open', '2025-01-10', 'High', 'Fraud through fake banking sites', 1, 1),
(202, 'Drug Supply Ring', 'Under Investigation', '2024-12-05', 'Medium', 'Intercity drug trafficking', 3, 3),
(203, 'Contract Killing', 'Closed', '2024-11-01', 'High', 'Professional hitman case', 2, 2);
INSERT INTO CRIMINAL_CASE 
VALUES
(101, 201),
(103, 202),
(102, 203);
INSERT INTO ARREST_RECORD 
VALUES
(301, 101, '2025-01-15', 'Lahore', 'Arrested'),
(302, 103, '2024-12-10', 'Rawalpindi', 'Released'),
(303, 102, '2024-11-15', 'Karachi', 'Transferred');
INSERT INTO EVIDENCE VALUES
(401, 201, 1, 'Digital', 'Fake banking website source code', '2025-01-12'),
(402, 202, 3, 'Physical', 'Drug packets seized', '2024-12-06'),
(403, 203, 2, 'Document', 'Contract documents', '2024-11-03');
INSERT INTO AGENT_PHONE 
(agent_id, phone_no)
 VALUES
(1, '+923001234567'),
(1, '+923451112233'),
(2, '+923009876543');
INSERT INTO USERS 
VALUES
(1, 'admin', 'admin123', 'Active', '2025-01-01 10:00:00'),
(2, 'agent_ali', 'agent123', 'Active', '2025-01-02 09:30:00'),
(3, 'analyst_sara', 'analyst123', 'Inactive', NULL);
INSERT INTO ROLE 
VALUES
(1, 'Admin'),
(2, 'Agent'),
(3, 'Analyst');
INSERT INTO USER_ROLE
VALUES
(1, 1),
(2, 2),
(3, 3);
INSERT INTO ACCESS_LOG
VALUES
(1, 1, '2025-01-01 10:00:00', '2025-01-01 12:00:00', '192.168.1.1'),
(2, 2, '2025-01-02 09:30:00', '2025-01-02 11:00:00', '192.168.1.2');
INSERT INTO INVESTIGATION_LOG 
VALUES
(1, 201, 2, 'Initial investigation started', '2025-01-11 14:00:00'),
(2, 202, 3, 'Suspect identified', '2024-12-07 16:30:00');
INSERT INTO EVIDENCE_REPORT 
VALUES
(501, 401, 'Source code confirms phishing activity', '2025-01-13'),
(502, 403, 'Document proves contractual killing', '2024-11-04');
SET SQL_SAFE_UPDATES = 0;

SELECT * FROM AGENT_PHONE;
SELECT * FROM USERS;
SELECT * FROM ACCESS_LOG;
SELECT 
    u.user_id,
    u.username,
    u.status,
    r.role_name
FROM USERS u
JOIN USER_ROLE ur ON u.user_id = ur.user_id
JOIN ROLE r ON ur.role_id = r.role_id
WHERE u.username = 'admin'
AND u.password = 'admin123'
AND u.status = 'Active';
SELECT 
    u.user_id,
    u.username,
    r.role_name
FROM USERS u
JOIN USER_ROLE ur ON u.user_id = ur.user_id
JOIN ROLE r ON ur.role_id = r.role_id
WHERE u.username = 'agent_ali'
AND u.password = 'agent123'
AND u.status = 'Active';
SELECT 
    u.user_id,
    u.username,
    u.status,
    r.role_name
FROM USERS u
JOIN USER_ROLE ur ON u.user_id = ur.user_id
JOIN ROLE r ON ur.role_id = r.role_id;
INSERT INTO USERS
VALUES (4, 'forensic_umar', 'forensic123', 'Active', NULL);
INSERT INTO ROLE VALUES (4, 'Forensic');
INSERT INTO USER_ROLE
VALUES (4, 4);
UPDATE USERS
SET status = 'Suspended'
WHERE username = 'analyst_sara';
SELECT 
    ca.case_id,
    ca.title,
    ca.status,
    ca.priority_level
FROM CASES ca
JOIN FBI_AGENT fa ON ca.agent_id = fa.agent_id
WHERE fa.first_name = 'Ali';
SELECT DISTINCT
    c.criminal_id,
    c.first_name,
    c.last_name,
    c.address_city
FROM CRIMINAL c
JOIN CRIMINAL_CASE cc ON c.criminal_id = cc.criminal_id
JOIN CASES ca ON cc.case_id = ca.case_id
JOIN FBI_AGENT fa ON ca.agent_id = fa.agent_id
WHERE fa.first_name = 'Ali';
UPDATE CASES
SET status = 'Closed'
WHERE case_id = 201;
SELECT 
    e.evidence_id,
    e.evidence_type,
    e.description,
    e.collection_date
FROM EVIDENCE e
WHERE e.case_id = 201;
INSERT INTO EVIDENCE_FILE (evidence_id, file_path)
VALUES (401, 'files/phishing_code.zip');
INSERT INTO EVIDENCE_REPORT
VALUES (503, 402, 'Chemical analysis confirms narcotics', CURDATE());
SELECT 
    ct.crime_name,
    COUNT(ca.case_id) AS total_cases
FROM CASES ca
JOIN CRIME_TYPE ct ON ca.crime_type_id = ct.crime_type_id
GROUP BY ct.crime_name;
SELECT 
    status,
    COUNT(*) AS total_cases
FROM CASES
GROUP BY status;
SELECT 
    ca.case_id,
    ca.title,
    ct.crime_name,
    ct.severity_level
FROM CASES ca
JOIN CRIME_TYPE ct ON ca.crime_type_id = ct.crime_type_id
WHERE ct.severity_level IN ('High', 'Critical');
INSERT INTO ACCESS_LOG
VALUES (3, 2, NOW(), NULL, '192.168.1.10');
UPDATE ACCESS_LOG
SET logout_time = NOW()
WHERE user_id = 2
ORDER BY login_time DESC
LIMIT 1;

SELECT agent_id, first_name, last_name, agent_rank, department_name
FROM FBI_AGENT;
SELECT 
    first_name AS "First Name",
    last_name AS "Last Name",
    agent_rank AS "Rank"
FROM FBI_AGENT
ORDER BY 
FIELD(agent_rank, 'Junior', 'Senior', 'Inspector', 'Director');
SELECT 
    a.first_name,
    a.last_name,
    c.title,
    c.status
FROM FBI_AGENT a
JOIN CASES c
ON a.agent_id = c.agent_id;
 
SELECT 
    crime_type_id,
    COUNT(*) AS Total_Cases
FROM CASES
GROUP BY crime_type_id
HAVING COUNT(*) >= 1;
SELECT first_name, last_name
FROM FBI_AGENT
WHERE agent_id IN (
    SELECT agent_id
    FROM CASES
    WHERE status = 'Open'
);
UPDATE CASES
SET status = 'Closed'
WHERE case_id = 201;
DELETE FROM AGENT_PHONE
WHERE phone_no = '+923451112233';
SELECT * FROM USERS;
UPDATE ACCESS_LOG
SET logout_time = NOW()
WHERE user_id = 1
ORDER BY login_time DESC
LIMIT 1;
UPDATE USERS
SET status = 'Inactive'
WHERE user_id = 1;
SELECT 
    u.username,
    r.role_name
FROM USERS u
JOIN USER_ROLE ur ON u.user_id = ur.user_id
JOIN ROLE r ON ur.role_id = r.role_id;
SELECT * FROM USER_ROLE;
SELECT*FROM ROLE;
SELECT 
    c.criminal_id,
    c.first_name,
    c.last_name,
    ct.crime_name,
    ct.severity_level
FROM CRIMINAL c
JOIN CRIMINAL_CASE cc ON c.criminal_id = cc.criminal_id
JOIN CASES ca ON cc.case_id = ca.case_id
JOIN CRIME_TYPE ct ON ca.crime_type_id = ct.crime_type_id;
SELECT 
    ca.case_id,
    ca.title AS case_title,
    ca.status AS case_status,
    fa.first_name,
    fa.last_name
FROM CASES ca
JOIN FBI_AGENT fa ON ca.agent_id = fa.agent_id;
SELECT 
    agent_id,
    first_name,
    last_name,
    department_name,
    agent_rank
FROM FBI_AGENT;
SELECT * FROM CRIMINAL;
SELECT * FROM WARRANT;

CREATE OR REPLACE VIEW view_active_cases AS
SELECT 
    c.case_id,
    c.title,
    c.priority_level,
    c.opening_date,
    CONCAT(a.first_name, ' ', a.last_name) AS assigned_agent
FROM CASES c
JOIN FBI_AGENT a ON c.agent_id = a.agent_id
WHERE c.status IN ('Open', 'Under Investigation');


CREATE OR REPLACE VIEW view_high_risk_criminals AS
SELECT 
    c.criminal_id,
    CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    c.national_identification_number,
    COUNT(ar.arrest_id) AS total_arrests
FROM CRIMINAL c
JOIN ARREST_RECORD ar ON c.criminal_id = ar.criminal_id
GROUP BY c.criminal_id
HAVING COUNT(ar.arrest_id) > 0;


DELIMITER //

CREATE PROCEDURE GetAgentPerformance(IN input_agent_id INT)
BEGIN
    SELECT 
        a.agent_id,
        CONCAT(a.first_name, ' ', a.last_name) AS agent_name,
        COUNT(c.case_id) AS total_cases_assigned,
        SUM(CASE WHEN c.status = 'Closed' THEN 1 ELSE 0 END) AS cases_solved
    FROM FBI_AGENT a
    LEFT JOIN CASES c ON a.agent_id = c.agent_id
    WHERE a.agent_id = input_agent_id
    GROUP BY a.agent_id;
END //

DELIMITER ;
SELECT * FROM view_active_cases;

SELECT CASES.title, FBI_AGENT.first_name, FBI_AGENT.last_name
FROM CASES
JOIN FBI_AGENT ON CASES.agent_id = FBI_AGENT.agent_id;

DESCRIBE CASES;
DESCRIBE CRIMINAL;

SELECT ARREST_RECORD.arrest_status, CRIMINAL.first_name, CRIMINAL.last_name
FROM ARREST_RECORD
JOIN CRIMINAL ON ARREST_RECORD.criminal_id=CRIMINAL.criminal_id;

SELECT * FROM FBI_AGENT;
SELECT * FROM USERS;

SELECT * FROM CRIMINAL;


SELECT *
FROM CRIMINAL
WHERE address_city = 'Bahawalnagar'
AND first_name LIKE 'K%';

SELECT * FROM USERS;

SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE USERS MODIFY user_id INT AUTO_INCREMENT;

ALTER TABLE USERS ADD role VARCHAR(50);
ALTER TABLE USERS ADD full_name VARCHAR(100);

SET FOREIGN_KEY_CHECKS=1;

UPDATE USERS SET role = 'Admin', full_name = 'Head Administrator' WHERE username = 'admin';
UPDATE USERS SET role = 'Agent', full_name = 'Field Agent Ali' WHERE username = 'agent_ali';
UPDATE USERS SET role = 'Analyst', full_name = 'Senior Analyst Sara' WHERE username = 'analyst_sara';
UPDATE USERS SET role = 'Forensic', full_name = 'Forensic Expert' WHERE username = 'kashafiqbal822'; -- Just in case!





SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE USERS MODIFY user_id INT AUTO_INCREMENT;

SET FOREIGN_KEY_CHECKS=1;

ALTER TABLE USERS ADD full_name VARCHAR(100);


UPDATE USERS SET role = 'Admin' WHERE username = 'admin';


UPDATE USERS SET role = 'Admin' WHERE username = 'Administrator';


SELECT username, role FROM USERS WHERE username = 'admin';

SELECT * FROM CRIMINAL;
SELECT * FROM USERS;
SELECT * FROM WARRANT;
SELECT * FROM ROLE;
SELECT * FROM EVIDENCE_REPORT;
SELECT * FROM EVIDENCE;