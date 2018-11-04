var express = require("express");
var app     = express();

app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/node_modules'));
//host all the shit in src using express server

app.get('/',function(req,res){
  res.sendFile('index.html');
  //It will find and locate index.html from View or Scripts
});

app.listen(3000);

console.log("Running at Port 3000");
