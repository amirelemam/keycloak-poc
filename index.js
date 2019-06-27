var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(5000);

console.log("Running at http://localhost:5000");