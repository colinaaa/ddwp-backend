import express from 'express';
import http from 'http';
// import jwt from 'express-jwt';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import morgan from 'morgan';
import helmet from 'helmet';
import { ApolloServer } from 'apollo-server-express';

import { WebSocketEndpoint } from '@shared/constants';
import { redisClient, redisCache } from '@shared/redis';
import logger from '@shared/Logger';
// import { JWTConfig } from '@shared/constants';
import router from './routes';
import schema from './schema';
import dataSources from './DataSources';

// Init express
const app = express();

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));

  // Security
  app.use(helmet());

  // Rate limits
  const limiter = rateLimit({
    store: new RedisStore({
      client: redisClient,
    }),
    max: 100, // limit each IP to 100 requests per windowMs
  });

  app.use(limiter);
}

const server = new ApolloServer({
  schema,
  dataSources,
  cache: redisCache,
  engine: {
    reportSchema: false,
  },
  subscriptions: {
    path: WebSocketEndpoint,
    onConnect(param) {
      logger.info('onConnect WebSocket', JSON.stringify(param));
    },
  },
});

// Load router
app.use(router);

// app.use('/graphql', jwt(JWTConfig).unless({ method: 'GET' }));

server.applyMiddleware({ app });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);

// Export express instance
export default httpServer;
