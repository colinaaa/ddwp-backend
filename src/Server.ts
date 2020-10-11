import express from 'express';
import jwt from 'express-jwt';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import morgan from 'morgan';
import helmet from 'helmet';

import { ApolloServer } from 'apollo-server-express';

import { redisClient, redisCache } from '@shared/redis';
import { JWTConfig } from '@shared/constants';
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

// Load router
app.use(router);

const server = new ApolloServer({
  schema,
  dataSources,
  cache: redisCache,
  engine: {
    reportSchema: false,
  },
});

app.use('/graphql', jwt(JWTConfig).unless({ method: 'GET' }));

server.applyMiddleware({ app });

// Export express instance
export default app;
