import { dbCon } from'../db/database.js'; // connect to DB

const addProperty =  (req, res)=>{//create property
  const { name, description, type, status, occupants } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
    createNotification(req.session.userId, 'Property', "Property has been updated");
  dbCon.query("INSERT INTO properties (userId, name, description, type, status, occupants) VALUES (?,?,?,?,?,?)",
    [userId, name, description, type, status, occupants],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating property");
      }
      res.redirect('/RealEstate.html')
    }
  )

}

  
}

const addIncome = (req, res)=>{//create income
  const { propertyId, amount, note, recorded_date } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
    createNotification(req.session.userId, 'INCOME', "Income has been added");
  dbCon.query("INSERT INTO incomes (userId,propertyId, amount, note,recorded_date) VALUES (?,?,?,?,?)",
    [userId,propertyId, amount, note,recorded_date],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating income");
      }
      res.redirect('/RealEstate.html')
    }
  )

}
}

const addExpense = (req, res)=>{//create expense
  const { propertyId, amount, note, recorded_date } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
    createNotification(req.session.userId, 'EXPENSE', "Expense has been added");
    dbCon.query("INSERT INTO expenses (userId,propertyId, amount, note,recorded_date) VALUES (?,?,?,?,?)",
    [userId,propertyId, amount, note,recorded_date],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating expense");
      }
      res.redirect('/RealEstate.html')
    }
  )

}
}

const addNotification = (req, res)=>{//create notification
  const { type, message } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
  dbCon.query("INSERT INTO real_estate_notifications (userId, type, message) VALUES (?,?,?)",
    [userId, type, message],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating Notification");
      }
      return res.status(201).json({
        message: "Notification created",
        id: result.insertId
      });
     
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
  dbCon.query("SELECT incomes.id, incomes.propertyId, incomes.amount, incomes.note, incomes.recorded_date, incomes.created_at, properties.name AS property_name FROM incomes LEFT JOIN properties ON incomes.propertyId = properties.id WHERE incomes.userId = ?",
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
  dbCon.query("SELECT expenses.id, expenses.propertyId, expenses.amount, expenses.note,expenses.recorded_date, expenses.created_at, properties.name AS property_name FROM expenses LEFT JOIN properties ON expenses.propertyId = properties.id WHERE expenses.userId = ?",
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

const getNotifications = (req, res) =>{//retrieve notifications to display
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("SELECT id, type, message, created_at FROM real_estate_notifications WHERE userId = ?",
    [req.session.userId],
    (err, results) => {
      if(err){
        console.error("Failed to retrieve notifications:", err);
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
  createNotification(req.session.userId, 'Property', "Property has been deleted");
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
  createNotification(req.session.userId, 'INCOME', "Income has been deleted");
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
  createNotification(req.session.userId, 'EXPENSE', "Expense has been deleted");
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

const deleteNotification = (req, res) =>{//deletes a notification
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("DELETE FROM real_estate_notifications WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if(err){
        console.error("Failed to delete notification:", err);
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
  createNotification(req.session.userId, 'Property', "Property has been updated");
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
    const { propertyId, amount, note, recorded_date } = req.body;
    if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  createNotification(req.session.userId, 'INCOME', "Income has been updated");
  dbCon.query("UPDATE incomes SET propertyId = ?, amount = ?, note = ?, recorded_date =? WHERE id = ? AND userId = ?;",
    [propertyId, amount,note,recorded_date,req.params.id, req.session.userId],
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
    const { propertyId, amount, note, recorded_date } = req.body;
    if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  createNotification(req.session.userId, 'EXPENSE', "Expense has been updated");
  dbCon.query("UPDATE expenses SET propertyId=?,amount = ?, note = ?,recorded_date=? WHERE id = ? AND userId = ?;",
    [propertyId,amount,note,recorded_date,req.params.id, req.session.userId],
    (err, results)=>{
        if(err){
            console.error("Failed to update expense:",err);
            return res.status(500).json({error: "Db error"});
        }
        res.json({success: results.affectedRows > 0});
    }
  )

}

function createNotification(userId, type, message){
  dbCon.query(
    "INSERT INTO real_estate_notifications (userId, type, message) VALUES (?,?,?)",
    [userId, type, message]
  );
}
export default {
  addProperty,
  addIncome,
  addExpense,
  addNotification,
  getProperties,
  getIncomes,
  getExpenses,
  getNotifications,
  deleteProperty,
  deleteIncome,
  deleteExpense,
  deleteNotification,
  updateProperty,
  updateIncome,
  updateExpense
};