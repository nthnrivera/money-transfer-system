const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path: './.env'});


const app = express();



const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public');


app.use(express.static(__dirname + '/public'));

//app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

db.connect((error) => {
    if(error){
        console.log(error);
    } else {
        console.log("MYSQL Connected");
    }
})



//aquires the different page routes
app.use('/', require('./routes/pages.js'));
app.use('/auth', require('./routes/auth.js'));

app.listen(5000, () => {
    console.log("Server started on Port 5000")
});