-- Create the database
CREATE DATABASE IF NOT EXISTS 481db;
USE 481db;

-- Temp users table
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

-- Temp retirement table
CREATE TABLE retirement_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,                 
  account_type VARCHAR(50) NOT NULL, 
  display_name VARCHAR(100);  
  current_balance DECIMAL(12,2) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
