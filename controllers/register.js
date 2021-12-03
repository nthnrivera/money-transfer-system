//require mysql
const mysql = require('mysql');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var path = require('path');

//databser login information
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

//passes login information to the database
exports.register = (req, res) => {
    console.log(req.body);

    //parses the inputs from the register page into variables
    const name = req.body.registerUsername;
    const email = req.body.registerEmail;
    const password = req.body.registerPassword;
    const confirmPassword = req.body.confirmPassword;
    //const{registerUsername, registerEmail, registerPassword, confirmPassword} = req.body;

    console.log('starting query');
    db.query('SELECT userEmail FROM users WHERE userEmail = ?', [email], async (error, results) => {
        console.log('query running');
        
        if (error) {
            console.log(error);
        }

        if(results.length > 0) {
            console.log('email is in use');
            return res.sendFile(path.resolve('views/signup.html'), 
            {message: 'Email already in use'});
            
        } 
         else if(password !== confirmPassword) {
            console.log('entry: ' + password + ' does not match entry: ' + confirmPassword); 
            return res.sendFile(path.resolve('views/signup.html'), 
            {message: 'Passwords must be matching'});
        }

        console.log('hashing password');
        let hashedPassword = await bcrypt.hash(password, 8);

        console.log(hashedPassword);


        db.query('INSERT INTO users SET ?', {userName: name, userEmail: email, userPassword: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error);
            }
            else {
                console.log('register successful');
            }
        });

        console.log('creating bank accounts');

        db.query('Select userID FROM users WHERE userEmail = ?', email, (error, results) => {
            if (error) {
                console.log(error);
            }

            var userID = results[0].userID;

            if(userID !== undefined)
            {
                db.query('INSERT INTO accounts SET ?', {users_userID: userID, accountType: 'Checking', accountBalance: 100}, (error, results) =>{
                    console.log('creating checking');
                    if (error) {
                        console.log(error);
                    }
                });

                db.query('INSERT INTO accounts SET ?', {users_userID: userID, accountType: 'Savings', accountBalance: 100}, (error, results) =>{
                    console.log('creating savings');
                    if (error) {
                        console.log(error);
                    }
                });
            }

            res.render(path.resolve('views/index.hbs'));
        });
    });
}