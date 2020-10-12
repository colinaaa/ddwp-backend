import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';

// Register Enum
import './enum';
import UserResolver from './resolvers/user';
import RoomResolver from './resolvers/room';

const schema = buildSchemaSync({
  emitSchemaFile: true,
  resolvers: [UserResolver, RoomResolver],
  container: Container,
});

export default schema;
