import cors from 'cors';
import { Router } from 'express';
import { errorReporter } from 'express-youch';
import { OK } from 'http-status-codes';

import errorHandler from '@controllers/error';
import user from './user';

// Init router and path
const router = Router();

// Add sub-routes
router.use(cors());

// Ping!
router.all('/ping', (_req, res) => {
  res.status(OK).send('pong\n').end();
});

// Health check
router.all('/healthcheck', (_req, res) => {
  res.status(OK).json({ status: 'pass' }).end();
});

// User manage {login, register}
router.use('/user', user);

// Error handling using youch
router.use(errorReporter());

// Fallback
router.use(errorHandler);

// Export the base-router
export default router;
