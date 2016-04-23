// dependancies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//custom modules
var myExports = require('./controllers/exports');

//enables packages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//use public folder for CSS and all that
app.use(express.static('public'));

//set view engine
app.set('view engine', 'ejs');

//routes
app.get('/', myExports.index );
app.get('/document', myExports.document );
app.get('/numbers', myExports.numbers );
app.get('/map', myExports.map );

//listen on the localhost
app.listen(8080, function() {
    console.log("Express started...");
});
