import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';

// Register Enum
import './enum';
import UserResolver from './resolvers/user';

const schema = buildSchemaSync({
  emitSchemaFile: true,
  resolvers: [UserResolver],
  container: Container,
});

export default schema;
