//import koa
var Koa = require('koa');
//import koa-router which is used to route user request to its path
var Router = require('koa-router');
const cors = require('@koa/cors');
const { userAgent } = require('koa-useragent'); //for getting user agent

//create a koa instance and store it in app variable
var app = new Koa();
app.proxy=true //to get the users ip

var router = new Router();

app.use(userAgent); //gets the user agent

//http://localhost:3000/api/v1.0 -> at this route, display logIn
//Routes will go here

var logIn = require('./routes/logIn.js')
var admin = require('./routes/admin.js')
var home = require('./routes/home.js')


app.use(cors()); 
app.use(logIn.routes());
app.use(admin.routes());
app.use(home.routes());


//set to be the environment/deployment port number or 3000 if there isnt one
var port = process.env.PORT || 5000; 

//run the werver on port 3000
app.listen(port); 
