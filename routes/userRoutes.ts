import passport from '../services/passport';
import { Request, Response } from 'express';
import prepareRenderData from "../utilities/prepareRenderData";
const router = require('express').Router();
const User = require('../models/User');
const crypto = require('crypto');


router.get('/me', (request: Request, response: Response) => {
    if (request.isAuthenticated()) {
        response.render('user/profile', prepareRenderData({ user: request.user }));
    } else {
        response.redirect('/user/login')
    }
})


router.get('/login', (request: Request, response: Response) => {
    if (request.isAuthenticated()){
        response.redirect('/user/me');
    } else {
        response.render('user/login');
    }
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/user/login'}),
    async (request: Request, response: Response) => {
        response.redirect('/user/me');
})



router.get('/signup', (request: Request, response: Response) => {
    if (request.isAuthenticated()){
        response.redirect('/user/me');
    } else {
        response.render('user/register', prepareRenderData({fields: {}}));
    }
})

router.post('/signup', async (request: Request, response: Response) => {
    const { username, email, password, repassword } = request.body;
    const errors: {[key: string]: string} = {};
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

export default router;
