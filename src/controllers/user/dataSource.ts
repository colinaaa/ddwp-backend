import { MongoDataSource } from 'apollo-datasource-mongodb';
import { DocumentType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import User from '@models/user';

export default class Users extends MongoDataSource<DocumentType<User>> {
  getUser(userId: ObjectId): Promise<User | null | undefined> {
    return this.findOneById(userId);
  }
}
