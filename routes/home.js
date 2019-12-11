'use strict';

var Router = require('koa-router');

var model = require('../models/home.js');

var router = Router({
   prefix: '/api/v1.0/home'
});  //Prefixed all routes with /api/v1.0/articles

//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');

const authenticated = require('../middleware/authenticated');

//note that we have injected the body parser onlyin the POST request
router.delete('/delete/:id', bodyParser(), async (cnx, next) =>{ //deletes an account through a specific ID
   //console.log(cnx.params.id) //how to get the passed id
   try{
      let id = await model.delete(cnx.params.id);
      cnx.response.status = 201;
      cnx.body = {message:id};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});


router.get('/getOne/:id',  authenticated, async (cnx, next) =>{
   //returns the login history of one specific instance
   try{
      let id = await model.getOne(cnx.params.id)
      //console.log("Success")
      //console.log(id)
      //attemptDate: 2019-10-30T00:00:00.000Z
      let date = String(id[0].attemptDate)
      date = date.slice(0, -40) //slicing off last part
      id[0].attemptDate = date
      cnx.response.status = 201;
      cnx.body = id
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

router.get('/getAll/:pageNumber/:itemsPerPage', authenticated, async (cnx, next) =>{ 
   //returns all login history (with pagination)
   try{
      const username = cnx.request.jwtPayload.sub

      const pageNumber = cnx.params.pageNumber
      const itemsPerPage = cnx.params.itemsPerPage

      //console.log(username + " searches for login history")
      //console.log("page number: " + pageNumber + " and items per page: " + itemsPerPage)

      let results = await model.getAll(username, pageNumber, itemsPerPage)
      //console.log("Success")
      cnx.response.status = 201;
      cnx.body = {message:results};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});


router.get('/getAccountInfo',  authenticated, bodyParser(), async (cnx, next) =>{
   //returns teh account info for the current logged in user
   try {
        const user = cnx.request.jwtPayload.sub
        //console.log(user)
        let results = await model.getAccountInfo(user)
        //console.log(results)
        cnx.response.status = 200
        cnx.body = results
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

router.put('/updateInfo', authenticated, bodyParser(), async (cnx, next) =>{
   //updates the account info for the signed in user
   const jwtUsername = cnx.request.jwtPayload.sub


   let updatedAccount = {
      username : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.username, 
      firstName : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.firstName,
      lastName : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.lastName,
      email : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.email,
      about : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.about,
      countryID : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.countryID,
      profileImageURL : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.profileImageURL,
    };  
    //validate data here as well!

    //console.log(updatedAccount)


   try {
        let results = await model.updateAccountInfo(jwtUsername, updatedAccount.username, updatedAccount.firstName, updatedAccount.lastName, updatedAccount.email, updatedAccount.about, updatedAccount.countryID, updatedAccount.profileImageURL)//SEND ALL DATA FROM CNX
        //console.log(results)
        cnx.response.status = 200
        cnx.body = results
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

module.exports = router;