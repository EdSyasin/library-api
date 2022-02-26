const router = require('express').Router();
const prepareRenderData = require('../utilities/prepareRenderData');
const config = require("../config");

router.get('/login', async (request, response) => {
    //Check for login
    response.render('user/login');
})

router.get('/signup', async (request, response) => {
    //Check for login
    response.render('user/register');
})

module.exports = router;
