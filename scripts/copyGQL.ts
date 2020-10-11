import { resolve } from 'path';
import { copyFile } from 'fs';

const rootPath = resolve(__dirname, '../');

const schemaFile = 'schema.graphql';

copyFile(resolve(rootPath, 'src', schemaFile), resolve(rootPath, 'dist', schemaFile), (err) =>
  // eslint-disable-next-line no-console
  err ? console.error(err) : null
);
