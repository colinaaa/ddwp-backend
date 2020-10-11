import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import { bootstrap } from 'global-agent';

// Setup global proxy
bootstrap();

// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'development',
    type: String,
  },
]);

// Set the env file
const env = dotenv.config({
  path: `./env/${options.env}.env`,
});

if (env.error) {
  throw env.error;
}
