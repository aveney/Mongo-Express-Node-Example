var express = require('express');
var MongoClient = require('mongodb').MongoClient
var bParser = require('body-parser');
var app = express();

var counter = 0;
var enteredTask;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//body-parser package is used to handle the data from the POST
app.use(bParser.urlencoded({ extended: true}));

//Page for creating an account 
app.get('/', function (req, res) {
	var html = '<form action="/" method="post">' +
               'Enter First Name:' +
               '<input type="text" name="newFName" />' +
               '<br>' +
			   'Enter Last Name:' +
               '<input type="text" name="newLName" />' +
               '<br>' +
			   'Enter Email Address:' +
               '<input type="text" name="newEmail" />' +
               '<br>' +
			   'Enter Username:' +
               '<input type="text" name="newUser" />' +
               '<br>' +
			   'Enter Password:' +
               '<input type="password" name="newPass" />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

app.post('/', function(req, res){
  var userFName = req.body.newFName;
  var userLName = req.body.newLName;
  var userEmail = req.body.newEmail;
  var userName = req.body.newUser;
  var userPass = req.body.newPass;
  MongoClient.connect('mongodb://localhost:27017/textInfo', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('text');
		counter = counter + 1;
		dbCollection.insert({"User":"user" + counter, "First Name":userFName, "Last Name":userLName, "Email Address":userEmail, "Username":userName, "Password":userPass, "textValue":enteredTask}, function(err, result) {
			dbCollection.find().toArray(function (err, documents) {
			console.log(documents);
			 res.redirect('http://localhost:3001/default');
			 db.close();
			}); //end find
		}); //end insert
	}); //end .connect
});

//default page
app.get('/default', function (req, res) {
	var html = '<form action="/default" method="post">' +
               '<h1>This is the default page</h1>' +
               '<br>' +
			   '<a href="http://localhost:3001/tasks">Enter Tasks</a>' +
			   '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

app.post('/default', function(req, res){
	enteredTask = req.body.freeText;
  MongoClient.connect('mongodb://localhost:27017/textInfo', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('text');
	
			dbCollection.find().toArray(function (err, documents) {
			console.log(documents);
			 res.send(documents);
			 db.close();
			}); //end find
	}); //end .connect
});


//Enter tasks page
app.get('/tasks', function (req, res) {
	var html = '<form action="/tasks" method="post">' +
               '<h1>This is the Enter Tasks Page</h1>' +
               '<br>' +
			   '<textarea name="freeText" rows="4" cols="50"> </textarea>' + '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

app.post('/tasks', function(req, res){
	enteredTask = req.body.freeText;
  MongoClient.connect('mongodb://localhost:27017/textInfo', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('text');
		counter = counter + 1;
		dbCollection.insert({"textValue":enteredTask}, function(err, result) {
			dbCollection.find().toArray(function (err, documents) {
			console.log(documents);
			res.send(documents);
			 db.close();
			}); //end find
		}); //end insert
	}); //end .connect
});

app.listen(3001, function () {
    console.log('Listening on port 3001');
});