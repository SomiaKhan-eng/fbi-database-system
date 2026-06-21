-- Create a new user named 'fbi_agent' with password 'secure123'
CREATE USER 'fbi_agent'@'localhost' IDENTIFIED BY 'secure123';

-- Give this agent permission to access your FBI database
GRANT ALL PRIVILEGES ON fbi_criminal_db.* TO 'fbi_agent'@'localhost';

-- Save the changes
FLUSH PRIVILEGES;