'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');




exports.validate = async (user) => { //validates whether the user login details are correct
    try {
        //NOTE: FOR USER SAVED IN DB:
        //USERNAME = "Joseph", PASSWORD = "Joseph"

        //server validation rules 
        //username is required        
        if(user.username === undefined){
            throw {message:'username is required', status:400};
        }
        //password is required
        if(user.password === undefined){
            throw {message:'password is required', status:400};
        }

        //final check is to make sure that email should be unique and never been used in the system
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT ID, passwordSalt, password, deleted from user WHERE
                    username = \'${user.username}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);

        //creates sql statement to locate the user based on username
        let salt = ""
        try{
            salt = data[0].passwordSalt //set salt to be the saved salt for the user
        } catch {
            throw {message:'user not found', status:400}
        }

        if(data[0].deleted == 1) {
            throw {message:'account has been deleted', status:400}
        }

        let password = bcrypt.hashSync(user.password, salt);

        await connection.end();

        if(password == data[0].password) {
            //console.log("Correct details");
            return data[0].ID;
        }else{
            throw {message:'password does not match', status:400}
        }

    } catch (error) {

        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.saveLogin = async (username, ip, browser, deviceDetails, succeeded) => {
    //saves each login device details to the database
    try {
        let success = 1

        //DATE - format YYYY-MM-DD
        //TIME - format hh:mm:ss
        if(succeeded == false){
            success = 0
        }
        var d = new Date();

        const attemptDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() // get date
        const timeOfLogin = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() //get the time
        let sql = `INSERT INTO loginhistory(username, attemptDate, succeeded, IP, browser, timeOfLogin, deviceDetails) VALUES("${username}", "${attemptDate}", "${success}", "${ip}", "${browser}", "${timeOfLogin}", "${deviceDetails}")`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);
    } catch(err){
        if(err.status === undefined)
            err.status = 500;
        throw err;
    }
}