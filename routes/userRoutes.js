const router = require('express').Router();
const prepareRenderData = require('../utilities/prepareRenderData');
const config = require("../config");
const User = require('../models/User');
const crypto = require('crypto');
const passport = require('../services/passport');

router.get('/me', (request, response) => {
    if (request.isAuthenticated()) {
        response.json(request.user)
    } else {
        response.redirect('/user/login')
    }
})


router.get('/login', (request, response) => {
    if (request.isAuthenticated()){
        response.redirect('/user/me');
    } else {
        response.render('user/login');
    }
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/user/login'}),
    async (request, response) => {
        response.redirect('/user/me');
})



router.get('/signup', (request, response) => {
    if (request.isAuthenticated()){
        response.redirect('/user/me');
    } else {
        response.render('user/register', prepareRenderData({fields: {}}));
    }
})

router.post('/signup', async (request, response) => {
    const { username, email, password, repassword } = request.body;
    const errors = {};
    let isValid = true;
    if(!username) {
        errors.username = 'Введите имя пользователя';
        isValid = false;
    }
    if(!email) {
        errors.email = 'Введите почту';
        isValid = false;
    }
    if(!password) {
        errors.password = 'Введите пароль';
        isValid = false;
    }
    if(!repassword) {
        errors.repassword = 'Повторите пароль';
        isValid = false;
    }
    if(repassword !== password) {
        errors.repassword = 'Пароли не совпадают пароль';
        errors.password = 'Пароли не совпадают пароль';
        isValid = false;
    }
    if(isValid) {
        const newUser = new User({
            username,
            email,
            password: crypto.createHash('md5').update(password).digest('hex')
        });
        newUser.save();
        response.redirect('/user/login');
    } else {
        response.render('user/register', prepareRenderData({fields: {email, username, password, repassword}}, {}, errors));
    }
})

module.exports = router;
