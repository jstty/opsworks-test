/**
 * Created by josephsutton on 6/13/14.
 */

var express = require('express');
var app     = express();
var port = 80;
var connection;

// http://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-connectdb.html
try {
    var opsworksConfig  = require('shared/config/opsworks.js');

    if( opsworksConfig &&
        opsworksConfig.db &&
        opsworksConfig.db.adapter == "mysql") {

        opsworksConfig.db.user = opsworksConfig.db.username;
        var mysql      = require('mysql');
        var connection = mysql.createConnection(opsworksConfig.db);
    }
} catch(err){
    console.error("MySQL Connection Error:", err);
}

// Routes
app.get('/', function(req, res) {
    if(connection) {
        connection.connect();
        connection.query('SELECT CONCAT("Hello", " World") as info', function(err, rows, fields) {
            if (err) {
                res.send('Error:', err);
                return;
            }

            res.send('MySQL Data:', rows);
        });
        connection.end();
    } else {
        res.send('Hello World');
    }
});

app.listen(port);
console.log("Listening on port", port);