/**
 * Created by josephsutton on 6/13/14.
 */

var express = require('express');
var app     = express();

var port = 80;

// Routes
app.get('/', function(req, res) {
    res.send('Hello World:', process.env);
});

app.listen(port);
console.log("Listening on port", port);