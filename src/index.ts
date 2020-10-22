import './LoadEnv'; // Must be the first import
import 'reflect-metadata';
import './database';
import '@services/implements';

import logger from '@shared/Logger';
import app from './Server';
import task from './task';

// Start the server
const port = Number(process.env.PORT || 4000);

task.start();

app.listen({ port }, () => {
  logger.info(`🚀 Server ready at http://localhost:4000`);
  logger.info(`🚀 WebSocket waiting connections at ws://localhost:4000/graphql`);
});
