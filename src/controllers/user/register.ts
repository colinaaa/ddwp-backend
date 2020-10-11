import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';

import { UserModel } from '@models/user';
import errorMsg from '@shared/errorMsg';
import logger from '@shared/Logger';

export const registerVerify = [
  body('username').isString().withMessage('username is required'),
  body('password')
    .isString()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password at least 6 charaters'),
  body('phone').isMobilePhone('zh-CN').withMessage('phone is invalid'),
  body('email').optional().isEmail().normalizeEmail().withMessage('email is invalid'),
];

export const register: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array({ onlyFirstError: true })[0];
      return next(errorMsg(error.msg));
    }

    const { username, password, phone, email = '' } = req.body;

    const user = await UserModel.findByPhone(phone);

    if (user !== null) {
      logger.info(`find user with phone: ${user.phone}`);
      return next(errorMsg('user exists'));
    }

    const { _id } = await UserModel.create({
      username,
      password,
      phone,
      email,
    });

    logger.info(`create user with id: ${_id}`);

    res.json({ message: 'success' });

    return next();
  } catch (error) {
    return next(error);
  }
};
