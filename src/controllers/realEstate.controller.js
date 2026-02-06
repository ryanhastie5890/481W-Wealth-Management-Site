import { dbCon } from'../db/database.js'; // connect to DB

const addProperty =  (req, res)=>{//create property
  const { name, description, type, status, occupants } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
  dbCon.query("INSERT INTO properties (userId, name, description, type, status, occupants) VALUES (?,?,?,?,?,?)",
    [userId, name, description, type, status, occupants],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating property");
      }
      res.redirect('/RealEstate.html')
    }
  )}
}

const addIncome = (req, res)=>{//create income
  const { amount, note } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
  dbCon.query("INSERT INTO incomes (userId, amount, note) VALUES (?,?,?)",
    [userId, amount, note],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating income");
      }
      res.redirect('/RealEstate.html')
    }
  )}
}

const addExpense = (req, res)=>{//create expense
  const { amount, note } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
  dbCon.query("INSERT INTO expenses (userId, amount, note) VALUES (?,?,?)",
    [userId, amount, note],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating expense");
      }
      res.redirect('/RealEstate.html')
    }
  )}
}

const getProperties = (req, res) =>{//retrieve properties to display
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("SELECT id, name, description, type, status, occupants, created_at FROM properties WHERE userId = ?",
    [req.session.userId],
    (err, results) => {
      if(err){
        console.error("Failed to retrieve properties:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json(results);
    }
  );
};

const getIncomes = (req, res) =>{//retrieve incomes to display
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("SELECT id, amount, note, created_at FROM incomes WHERE userId = ?",
    [req.session.userId],
    (err, results) => {
      if(err){
        console.error("Failed to retrieve incomes:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json(results);
    }
  );
};

const getExpenses = (req, res) =>{//retrieve incomes to display
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("SELECT id, amount, note, created_at FROM expenses WHERE userId = ?",
    [req.session.userId],
    (err, results) => {
      if(err){
        console.error("Failed to retrieve expenses:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json(results);
    }
  );
};

const deleteProperty = (req, res) =>{//deletes a property
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("DELETE FROM properties WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if(err){
        console.error("Failed to delete property:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json({success: results.affectedRows > 0});
    }
  );
};

const deleteIncome = (req, res) =>{//deletes an income
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("DELETE FROM incomes WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if(err){
        console.error("Failed to delete income:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json({success: results.affectedRows > 0});
    }
  );
};

const deleteExpense = (req, res) =>{//deletes an expense
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("DELETE FROM expenses WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if(err){
        console.error("Failed to delete expense:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json({success: results.affectedRows > 0});
    }
  );
};

const updateProperty = (req, res) =>{//update property data
    const {name, description, type, status, occupants } = req.body;
    if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("UPDATE properties SET name = ?, description = ?, type = ?, status = ?, occupants = ? WHERE id = ? AND userId = ?;",
    [name,description,type,status,occupants,req.params.id, req.session.userId],
    (err, results)=>{
        if(err){
            console.error("Failed to update property:",err);
            return res.status(500).json({error: "Db error"});
        }
        res.json({success: results.affectedRows > 0});
    }
  )

}

const updateIncome = (req, res) =>{//update income data
    const { amount, note } = req.body;
    if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("UPDATE incomes SET amount = ?, note = ? WHERE id = ? AND userId = ?;",
    [amount,note,req.params.id, req.session.userId],
    (err, results)=>{
        if(err){
            console.error("Failed to update income:",err);
            return res.status(500).json({error: "Db error"});
        }
        res.json({success: results.affectedRows > 0});
    }
  )


}

const updateExpense = (req, res) =>{//update expense data
    const {  amount, note } = req.body;
    if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("UPDATE expenses SET amount = ?, note = ? WHERE id = ? AND userId = ?;",
    [amount,note,req.params.id, req.session.userId],
    (err, results)=>{
        if(err){
            console.error("Failed to update expense:",err);
            return res.status(500).json({error: "Db error"});
        }
        res.json({success: results.affectedRows > 0});
    }
  )

}

export default {
  addProperty,
  addIncome,
  addExpense,
  getProperties,
  getIncomes,
  getExpenses,
  deleteProperty,
  deleteIncome,
  deleteExpense,
  updateProperty,
  updateIncome,
  updateExpense
};