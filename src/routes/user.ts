import { Router, json, urlencoded } from 'express';

import { login, loginVerify } from '@controllers/user/login';
import { register, registerVerify } from '@controllers/user/register';

const router = Router();

router.use(json({ limit: '1mb' }));

router.use(urlencoded({ extended: true }));

router.post('/login', loginVerify, login);

router.post('/register', registerVerify, register);

export default router;
