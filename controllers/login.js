const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const session = require('express-session');

var path = require('path'); 
const { debug } = require('console');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})


exports.login = (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;
 
    console.log('starting query');
    db.query('SELECT userPassword FROM users WHERE username = ?', username, (error,results) => {
        if (error) {
            console.log(error);

            return res.sendFile(path.resolve('views/index.html'), 
            {message: 'Incorrect username or password'});
        }
        
        var hashedPassword = results[0].userPassword;

        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (error) {
                console.log(error);

                return res.sendFile(path.resolve('views/index.html'), 
                {message: 'Incorrect username or password'});
            }

            db.query('SELECT * FROM users WHERE username = ?', username, (error, result) => {
                if (error) {
                    console.log(error);
    
                    return res.sendFile(path.resolve('views/index.html'), 
                    {message: 'Incorrect username or password'});
                }

                console.log('Retrieving user information');

                var userID = result[0].userID;
                var username = result[0].userName;
                var email = result[0].userEmail;

                db.query('SELECT * FROM accounts WHERE users_userID = ?', userID, (error, result) => {
                    if (error) {
                        console.log(error);
                    }

                    var account = [result[0].accountID, result[1].accountID];
                    var accountType = [result[0].accountType, result[1].accountType];
                    var accountBalance = [result[0].accountBalance, result[1].accountBalance];

                    res.render(path.resolve('views/account.hbs'), {
                        post: {
                            userID: userID,
                            username: username,
                            email: email,
                            account1: account[0],
                            accountType1: accountType[0],
                            accountBalance1: accountBalance[0],
                            account2: account[1],
                            accountType2: accountType[1],
                            accountBalance2: accountBalance[1]
                        }
                    });
                })

                //res.sendFile(path.resolve('views/account.html'));
                
            })
            
        })
    });
}