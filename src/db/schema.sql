-- Create the database
CREATE DATABASE IF NOT EXISTS 481db;
USE 481db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT, 
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('Apartment','House','Land') NOT NULL,    
  status ENUM('Self Owned','Rented Out','Selling','Leasing') NOT NULL DEFAULT 'Self Owned',
  occupants INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Stock Investments
CREATE TABLE investments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  shares DECIMAL(15,6) NOT NULL,
  average_price DECIMAL(15,4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (userId, symbol),

  FOREIGN KEY (userId)
    REFERENCES users(id)
    ON DELETE CASCADE
);
