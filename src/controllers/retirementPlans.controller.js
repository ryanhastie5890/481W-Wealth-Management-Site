import { dbCon } from '../db/database.js';     // connect to DB to run queries

/*
*   create a new retirement plan
*/
export const createPlan = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  let {
    name,
    current_age,
    retirement_age,
    annual_contribution,
    expected_return
  } = req.body;

  // if no expected return provided insert default 5.5
  // FIX ME: see if this can be corrected else where
  if (!expected_return || expected_return === '') {
    expected_return = 5.5;
  }

  const sql = `
    INSERT INTO retirement_plans
    (user_id, name, current_age, retirement_age, annual_contribution, expected_return)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  dbCon.query(
    sql,
    [
      req.session.userId,
      name,
      current_age,
      retirement_age,
      annual_contribution,
      expected_return
    ],
    (err, result) => {
      if (err) {
        console.error('DB INSERT ERROR:', err);
        return res.status(500).json({ error: 'Database error. Unable to create plan.' });
      }

      res.json({ success: true, result });
    }
  );
};

/*
*   get all retirement plans for user
*/
export const getPlans = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const sql = `
    SELECT *
    FROM retirement_plans
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  dbCon.query(sql, [req.session.userId], (err, results) => {
    if (err) {
      console.error('DB SELECT ERROR:', err);
      return res.status(500).json({ error: 'Database error. Unable to get plans.' });
    }

    res.json(results);
  });
};

/*
*   delete retirement plan
*/
export const deletePlan = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const planId = req.params.id;

  const sql = `
    DELETE FROM retirement_plans
    WHERE id = ? AND user_id = ?
  `;

  dbCon.query(sql, [planId, req.session.userId], (err, result) => {
    if (err) {
      console.error('DB DELETE ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ success: true });
  });
};