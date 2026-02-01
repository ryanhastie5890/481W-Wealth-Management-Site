# 481W-Wealth-Management-Site
General repo for Wealth Management Site

## temp user database to import to MySQL
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## temp retirement databse to import to MySQL
CREATE TABLE retirement_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  account_type VARCHAR(50),      
  account_name VARCHAR(100),     
  current_balance DECIMAL(12,2),
  annual_contribution DECIMAL(12,2),
  expected_return DECIMAL(5,2),
  years_to_retirement INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);