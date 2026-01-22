// Module to establish DB connection on localhost

var mysql = require('mysql2');
// Create connection & verify credentials
var dbCon = mysql.createConnection(
  {       
    host     : 'localhost',
    user     : '481_mysql_user',
    password : '123pwd456',
    database : '481db'
  }
);

dbCon.connect(function(error){
	if (error) { // connection failed?
    console.log('Error connecting to DB ', error);
    return;
  }
  console.log('DBConnection established');
});

// export handle to the connection, for use in other models to access the DB
exports.dbCon = dbCon;