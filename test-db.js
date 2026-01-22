const dbCon = require('./database.js').dbCon;

dbCon.query('SELECT 1 + 1 AS result', function (error, results) {
  if (error) {
    console.log("Query error:", error);
    return;
  }
  console.log("Database responded. Result =", results[0].result);
});
