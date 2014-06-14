/**
 * Created by josephsutton on 6/13/14.
 */
var fs = require('fs');

var express = require('express');
var app     = express();
var port = process.env.PORT || 8080;
var connection;

var baseDir = '../shared/config';
var info = {};

info.env = process.env;
info.exists = false;
if(fs.existsSync(baseDir)) {
    info.exists = true;
    info.files = fs.readdirSync(baseDir);
}

// http://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-connectdb.html
try {
    info.loadedConfig = false;
    var opsworksConfig  = require(baseDir+'/opsworks.js');
    info.loadedConfig = true;

    if( opsworksConfig &&
        opsworksConfig.db) {

        info.dataAdapter = opsworksConfig.db.adapter;
        if(opsworksConfig.db.adapter == "mysql") {

            opsworksConfig.db.user = opsworksConfig.db.username;
            var mysql      = require('mysql');
            var connection = mysql.createConnection(opsworksConfig.db);
        }
    }
} catch(err){
    console.error("Error:", err);
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
        res.send('Hello World:', info);
    }
});

app.listen(port);
console.log("Listening on port", port);