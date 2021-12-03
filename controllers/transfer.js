const mysql = require('mysql');

var path = require('path');
const {debug} = require('console');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

exports.transfer = (req, res) => {
    const sendingAccount = req.body.accountID1;
    const receivingAccount = req.body.accountID2;
    const ammount = req.body.ammount;

    console.log('Transfering funds from account ' + sendingAccount + ' to ' + receivingAccount + ' With ammount ' + ammount)

    console.log('Starting Query');

    db.query('UPDATE accounts SET accountBalance= accountBalance - ? WHERE accountID =?', [ammount, sendingAccount], (error, results) => {
        if(error) {
            console.log(error);
        }
        
        db.query('UPDATE accounts SET accountBalance= accountBalance + ? WHERE accountID =?', [ammount, receivingAccount], (error, results) => {
            if(error) {
                console.log(error);
            }
            
            db.query('SELECT * FROM accounts WHERE accountID =?', sendingAccount, (error, result) =>{
                if(error) {
                    console.log(error);
                }
                
                var account1 = sendingAccount;
                var accountType1 = result[0].accountType;
                var accountBalance1 = result[0].accountBalance;

                db.query('SELECT * FROM accounts WHERE accountID =?', receivingAccount, (error, result) =>{
                    var account2 = receivingAccount;
                    var accountType2 = result[0].accountType;
                    var accountBalance2 = result[0].accountBalance;

                    res.render(path.resolve('views/account.hbs'), {
                        post: {
                            account1: account1,
                            accountType1: accountType1,
                            accountBalance1: accountBalance1,
                            account2: account2,
                            accountType2: accountType2,
                            accountBalance2: accountBalance2
                        }
                    });
                })
                
            })
        })
    })
    
}