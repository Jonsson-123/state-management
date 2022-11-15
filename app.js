'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./utils/pass');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/form');
    }
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const username = 'foo';
const password = 'bar';

app.use(cookieParser());
app.use(session({secret: 'owendgyawjdw', cookie: {maxAge: 60000}}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');


app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
        console.log('success');
        res.redirect('/secret');
    });

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/secret', loggedIn, (req, res) => {
    res.render('secret');
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
