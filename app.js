'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const username = 'foo';
const password = 'bar';

app.use(cookieParser());
app.use(session({secret: 'owendgyawjdw', cookie: {maxAge: 60000}}));

app.set('views', './views');
app.set('view engine', 'pug');


app.post('/login', (req, res) => {
    if (req.body.password === password && req.body.username === username) {
        req.session.logged = true;
        res.redirect('/secret');
    } else {
        req.session.logged = false;
        res.redirect('/form');
    }
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/secret', (req, res) => {
    if (req.session.logged) {
        res.render('secret');
    } else {
        res.redirect('/form');
    }
});

app.get('/setCookie/:clr', (req, res) => {
    console.log(req.params.clr);
    res.cookie('color', req.params.clr).send('Eväste tehty');
});

app.get('/getCookie', (req, res) => {
    console.log(req.cookies.color);
    res.send("Evästeen sisältö " + req.cookies.color);

});
app.get('/deleteCookie', (req, res) => {
    res.clearCookie('color');
    res.send("Eväste on poistettu");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
