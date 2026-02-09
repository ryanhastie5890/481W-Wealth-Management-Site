import { dbCon } from '../db/database.js';     // connect to DB to run queries
// export function logger(req, res, next) {
//   console.log("Request Method: ", req.method);
//   console.log("Request URL: ", req.url);
//   next();
// }

export const addRetirementAccount = (req, res) => {
  console.log('Test: Adding Retirement Account');

  // check the user is logged in
  if (!req.session.userId) {
    console.log('No user logged in');
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { account_type, amount } = req.body;
  const sql = `
    INSERT INTO retirement_accounts (userId, account_type, current_balance)
    VALUES (?, ?, ?)
  `;
  dbCon.query(sql, [req.session.userId, account_type, amount], (err, result) => {
    if (err) {
      console.error('DB INSERT ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Inserted Retirement Account');
    console.log(`User ID: ${req.session.userId}`);
    console.log(`User Email: ${req.session.email}`);
    console.log(`Account Type: ${account_type}`);
    console.log(`Amount Entered: ${amount}`);

    res.json({ success: true });
  });
};