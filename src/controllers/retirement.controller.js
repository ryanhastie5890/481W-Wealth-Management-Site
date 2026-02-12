import { dbCon } from '../db/database.js';     // connect to DB to run queries
// export function logger(req, res, next) {
//   console.log("Request Method: ", req.method);
//   console.log("Request URL: ", req.url);
//   next();
// }

/*
*   create new retirement account and saves it in the retirement_accounts table.
*/
export const addRetirementAccount = (req, res) => {
  console.log('Test: Adding Retirement Account');

  // check the user is logged in
  if (!req.session.userId) {
    console.log('No user logged in');
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { account_type, amount } = req.body;
  const sql = `
    INSERT INTO retirement_accounts (userId, account_type, display_name, current_balance)
    VALUES (?, ?, ?, ?)
  `;

  dbCon.query(sql, [req.session.userId, account_type, account_type, amount], (err, result) => {
    if (err) {
      console.error('DB INSERT ERROR:', err);
      return res.status(500).json({ error: 'Database error. unable to add retirement account.' });
    }
    console.log('Inserted Retirement Account');
    console.log(`User ID: ${req.session.userId}`);
    console.log(`User Email: ${req.session.email}`);
    console.log(`Account Type: ${account_type}`);
    console.log(`Amount Entered: ${amount}`);

    res.json({ success: true });
  });
};

/*
*   obtain retirement account from the retirement_accounts table to display client side
*/  
export const getRetirementAccounts = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'not logged in' })
  }

  const sql = `
    SELECT id, account_type, display_name, current_balance
    FROM retirement_accounts
    WHERE userId = ?
    ORDER BY created_at ASC
  `;

  dbCon.query(sql, [req.session.userId], (err, results) => {
    if (err) {
      console.error('DB FETCH ERROR:', err);
      return res.status(500).json({ error: 'database error. unable to get retirement account.' });
    }

    res.json(results);
  });
};

/*
*   allow user to update existing retirement account in the retirement_accounts able.
*/
export const updateRetirementAccount = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'not logged in' });
  }

  const { id, display_name, amount } = req.body;

  const sql = `
    UPDATE retirement_accounts
    SET display_name = ?, current_balance = ?
    WHERE id = ? AND userId = ?
  `;

  dbCon.query(
    sql,
    [display_name, amount, id, req.session.userId],
    (err) => {
      if (err) {
        console.error('DB UPDATE ERROR:', err);
        return res.status(500).json({ error: 'database error. unable to update retirment account.' });
      }
      res.json({ success: true });
    }
  );
};
