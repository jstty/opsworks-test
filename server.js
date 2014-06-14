/**
 * Created by josephsutton on 6/13/14.
 */

var opsworksConfig  = require('shared/config/opsworks.js');

var express = require('express');
var app     = express();
var port = 80;

// http://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-connectdb.html
if( opsworksConfig &&
    opsworksConfig.db &&
    opsworksConfig.db.adapter == "mysql") {

    opsworksConfig.db.user = opsworksConfig.db.username;
    var mysql      = require('mysql');
    var connection = mysql.createConnection(opsworksConfig.db);
}


// Routes
app.get('/', function(req, res) {
    connection.connect();
    connection.query('SELECT * from test_table', function(err, rows, fields) {
        if (err) {
            res.send('Error:', err);
            return;
        }

        res.send('Data:', rows);
    });
    connection.end();
});

app.listen(port);
console.log("Listening on port", port);