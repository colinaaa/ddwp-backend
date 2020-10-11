import { MongoDataSource } from 'apollo-datasource-mongodb';
import { DocumentType, defaultClasses } from '@typegoose/typegoose';

import UserDataSource from '@controllers/user/dataSource';
import { UserModel } from '@models/user';

type DataSources = {
  [key: string]: MongoDataSource<DocumentType<defaultClasses.Base>>;
};

const dataSources = (): DataSources => ({
  users: new UserDataSource(UserModel),
});

export default dataSources;
