const express = require('express');

const router = express.Router();

var path = require('path');

router.get('/', (req, res) => {
    res.render(path.resolve('views/index.hbs'));
    //res.sendFile(path.resolve('views/index.hbs'));
});

router.get('/signup.html', (req, res) => {
    res.render(path.resolve('views/signup.hbs'));
    //res.sendFile(path.resolve('views/signup.html'));
});

router.get('/index.html', (req, res) => {
    res.render(path.resolve('views/index.hbs'));
    //res.sendFile(path.resolve('views/index.html'));
})

router.get('/account.html', (req, res) => {
    res.render(path.resolve('views/account.hbs'));
    //res.sendFile(path.resolve('views/account.html'));
})

router.get('/transfer.html'), (req, res) => {
    res.render(path.resolve('views/account.hbs'));
}

module.exports = router;