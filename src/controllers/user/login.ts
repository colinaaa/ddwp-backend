import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';

import { UserModel } from '@models/user';
import sign from '@shared/jwt';
import logger from '@shared/Logger';
import errorMsg from '@shared/errorMsg';

export const loginVerify = [
  body('username').isString().withMessage('Username is required'),
  body('password').isString().withMessage('Password is required'),
];

export const login: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array({ onlyFirstError: true })[0];
      return next(errorMsg(error.msg));
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return next(errorMsg('user not found', 'warn', UNAUTHORIZED));
    }

    const { password: pass, _id: id, username: name } = user;

    logger.info(`Got user: ${name}`);

    if (pass !== password) {
      return next(errorMsg('password invalid', 'error', BAD_REQUEST));
    }

    const token = sign({ id }, 24 * 60 * 60 * 1000);

    logger.info(`Gen token: ${token}`);

    res.json({ token });

    return next();
  } catch (error) {
    return next(error);
  }
};
