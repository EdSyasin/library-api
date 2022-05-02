import { Router } from 'express';
const router = Router();

router.get('/login', (request, response) => {
    response.status(201).json({id: 1, mail: 'test@mail.ru'});
})

export default router;
