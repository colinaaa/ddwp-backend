const developmentEnv = 'development';
const productionEnv = 'production';

const isDev = (): boolean => process.env.NODE_ENV === developmentEnv;

const isProd = (): boolean => process.env.NODE_ENV === productionEnv;

export { isDev, isProd };
