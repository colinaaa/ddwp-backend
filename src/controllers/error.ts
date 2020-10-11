import { ErrorRequestHandler } from 'express';
import { BAD_REQUEST } from 'http-status-codes';

import logger from '@shared/Logger';

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (!res.headersSent) {
    const { message, type = 'error', status = BAD_REQUEST } = error;

    logger.log({
      message,
      level: type,
    });

    res.status(status).json({ message, type, status });
  }

  next();
};

export default errorHandler;
