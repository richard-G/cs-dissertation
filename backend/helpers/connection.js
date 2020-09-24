var mysql = require('mysql');
var config = require('./config');

// https://stackoverflow.com/questions/40153085/how-does-createconnection-work-with-nodejs-in-mysql 
// https://medium.com/@mhagemann/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4
// ^^ above could be useful to create a pooled connection instead of all modules using the same single connection


var conn = mysql.createConnection(config);
conn.connect(
    function(err) {
        if (err) {
            console.log('!!! Cannot connect !!! Error:');
            throw err;
        } else {
            console.log('connection to database established.');
        }
    }
);

module.exports = conn;