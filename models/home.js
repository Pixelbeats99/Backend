'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');


exports.delete = async (id) => { //deletes an account
    try {

        //server validation rules 
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT deleted from user WHERE
                    id = \'${id}'`;
        const connection = await mysql.createConnection(info.config);


        var data = await connection.query(sql);

        if(data.length == 0){
            throw {message:'user not found', status: 400};
        } else if (data[0].deleted == 1) {
            throw {message:'account already deleted', status: 400}
        } else if (data[0].deleted == 0){
        sql = `UPDATE user 
                   SET deleted = true
                   WHERE id = \'${id}'`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            //console.log("Deleted!");
          });
        } 
        await connection.end();
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.getAll = async (username, pageNumber, itemsPerPage) => { //returns login history (pagination)
    try {

        let sql = `SELECT * from loginhistory WHERE  username = \'${username}'`
        const connection = await mysql.createConnection(info.config);
        const response = await connection.query(sql);
        const totalNumber = response.length

        itemsPerPage = parseInt(itemsPerPage, 10)
        pageNumber = parseInt(pageNumber, 10)


        if(totalNumber/itemsPerPage < pageNumber){
            throw {message:'no page for this result', status: 400};
        }
        
        if((itemsPerPage + (itemsPerPage * pageNumber)) > totalNumber){
            itemsPerPage = totalNumber - (itemsPerPage * pageNumber)
        }

        //console.log("Number of entries: " + totalNumber + ". Items allowed per page: " + itemsPerPage + " and page " + pageNumber)

        sql = `SELECT * from loginhistory WHERE
                    username = \'${username}' ORDER BY attemptDate DESC
                    LIMIT ${itemsPerPage} OFFSET ${(pageNumber-1)*itemsPerPage};`; 
        var data = await connection.query(sql);
        if(data.length == 0){
            throw {message:'not found', status: 400};
        } 
        await connection.end();
        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.getOne = async (id) => { //returns one instance of login history (by id)
    try {

        let sql = `SELECT * from loginhistory WHERE
                    id = \'${id}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);

        if(data.length == 0){
            throw {message:'not found', status: 400};
        } 
        await connection.end();
        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}




exports.getAccountInfo = async (username) => { //returns all account info for a specific username
    try {
        let sql = `SELECT username, firstName, lastName, email, about, dateRegistered, countryID, profileImageURL from user WHERE
                    username = \'${username}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);
        if(data.count==0) throw {message:'no user found', status: 400};
        await connection.end();

        let date = String(data[0].dateRegistered)
        date = date.slice(0, -40) //slicing off last part
        data[0].dateRegistered = date

        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.updateAccountInfo = async (jwtUsername, username, firstName, lastName, email, about, countryID, profileImageURL) => {
    //updates the account info for a specific user
    try {

        //validation here:
        //need to validate: email (format), countryID (needs to be a number)

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/;
        if(!re.test(String(email).toLowerCase())){
             throw {message:'email is not valid', status: 400};
        }
        if(isNaN(countryID)){
            throw {message:'country ID must be a number', status: 400};
        }


        let sql = `UPDATE user
        SET username = \'${username}', firstName= \'${firstName}', lastName= \'${lastName}', email= \'${email}', about= \'${about}', countryID= \'${countryID}', profileImageURL= \'${profileImageURL}'
        WHERE username = \'${jwtUsername}'`;
        const connection = await mysql.createConnection(info.config);
        connection.query(sql, function (err, result) {
            if (err) throw err;
            //console.log("Updated");
          });
        await connection.end();
    } catch (error) {
        //console.log(error)
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}






