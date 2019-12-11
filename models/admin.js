
'use strict';

var mysql = require('promise-mysql');
var info = require('../config');

exports.createTables = async ()=> {

    try {

        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `CREATE TABLE user (
                    ID INT NOT NULL AUTO_INCREMENT,
                    username TEXT,
                    password TEXT,
                    passwordSalt TEXT,
                    firstName TEXT,
                    lastName TEXT,
                    profileImageURL TEXT,
                    email TEXT,
                    about TEXT,
                    countryID TEXT,
                    birthDate DATETIME,
                    dateRegistered DATETIME,
                    active BOOL,
                    deleted BOOL,
                    PRIMARY KEY (ID)
                )`;
        await connection.query(sql);

        sql = `CREATE TABLE loginHistory (
                ID INT NOT NULL AUTO_INCREMENT,
                username TEXT,
                attemptDate DATE,
                succeeded BOOL,
                IP TEXT,
                browser TEXT,
                timeOfLogin TIME,
                deviceDetails TEXT,
                PRIMARY KEY (ID)
            )`;

        await connection.query(sql);

        sql = `CREATE TABLE passwordReminder (
            ID INT NOT NULL AUTO_INCREMENT,
            userID INT,
            securityQuestion1 TEXT,
            securityAnswer1 TEXT,
            securityQuestion2 TEXT,
            securityAnswer2 TEXT,
            PRIMARY KEY (ID)
        )`;

        await connection.query(sql);

        sql = `CREATE TABLE passwordChangeHistory (
            ID INT NOT NULL AUTO_INCREMENT,
            userID INT,
            oldPassword TEXT,
            dateChanged DATE,
            PRIMARY KEY (ID)
        )`;

        await connection.query(sql);

        sql = `CREATE TABLE signupMethod (
            ID INT NOT NULL AUTO_INCREMENT,
            serviceProvider TEXT,
            url TEXT,
            allowed BOOL,
            PRIMARY KEY (ID)
        )`;

        await connection.query(sql);

        sql = `CREATE TABLE countries (
            ID INT NOT NULL AUTO_INCREMENT,
            name TEXT,
            abbreviation TEXT,
            PRIMARY KEY (ID)
        )`;

        await connection.query(sql);
        
        return {message:"created successfully"};

    } catch (error) {
        console.log(error);
    }

}