/**
 * Created by josephsutton on 6/13/14.
 */
var fs   = require('fs');
var path = require('path');

var express = require('express');
var app     = express();
var port = process.env.PORT || 8080;
var connection;

var baseDir = path.join(process.cwd(), '../..', 'shared/config');
var info = {};

info.cwd = process.cwd();
info.env = process.env;
info.baseDir = baseDir;
info.exists = false;

if(fs.existsSync(baseDir)) {
    info.exists = true;
    info.baseDirFiles = fs.readdirSync(baseDir);
}

// http://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-connectdb.html
try {
    info.loadedConfig = false;
    var opsworksConfig  = require(baseDir+'/opsworks.js');
    info.loadedConfig = true;
    //info.opsworksConfig = opsworksConfig;

    if( opsworksConfig &&
        opsworksConfig.db) {

        info.dataType = opsworksConfig.db.type;
        if(opsworksConfig.db.type == "mysql") {

            opsworksConfig.db.user = opsworksConfig.db.username;
            var mysql      = require('mysql');
            var connection = mysql.createConnection(opsworksConfig.db);
        }
    }
} catch(err){
    console.error("Error:", err);
}

// default route
app.get('/', function(req, res) {
    // if connection then try to connect to mysql
    if(connection) {
        connection.connect();
        connection.query('SELECT CONCAT("Hello", " World") as info', function(err, rows, fields) {
            if (err) {
                res.send('Error: '+ JSON.stringify(err));
                return;
            }

            res.send('MySQL Data:'+ JSON.stringify(rows));
        });
        connection.end();
    } else {
        // else send info
        res.send(info);
    }
});

app.listen(port);
console.log("Listening on port", port);