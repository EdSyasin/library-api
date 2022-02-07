const router = require('express').Router()

router.get('/login', (request, response) => {
    response.status(201).json({id: 1, mail: 'test@mail.ru'});
})

module.exports = router;
