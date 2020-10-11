// Strings
export const paramMissingError = 'One or more of the required parameters was missing.';
export const loginFailedErr = 'Login failed';

// Numbers
export const pwdSaltRounds = 12;

// MongoDB
export const MongoConfig = {
  user: process.env.MONGO_USER || '',
  pass: process.env.MONGO_PASS || '',
  url: process.env.MONGO_URL || '',
};

// Redis
export const RedisConfig = {
  host: process.env.REDIS_HOST || '',
};

// JSON web token
export const JWTConfig = {
  secret: process.env.JWT_SECRET || 'secret',
  algorithms: ['HS256'],
};
