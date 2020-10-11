import { ObjectType, Field } from 'type-graphql';
import { prop, getModelForClass, ReturnModelType, DocumentType } from '@typegoose/typegoose';

@ObjectType()
export class User {
  @Field({ description: '用户名' })
  @prop({ required: true })
  username!: string;

  @Field({ description: '密码' })
  @prop({ required: true })
  password!: string;

  @Field({ description: '邮箱' })
  @prop({ required: true, unique: true })
  email!: string;

  @Field({ description: '手机号' })
  @prop({ required: true, unique: true })
  phone!: string;

  /**
   * findByPhone - find a user by phone
   * @async
   * @param {string} phone - the phone of the user
   * @returns {User | null} - the user with phone or null
   */
  public static async findByPhone(
    this: ReturnModelType<typeof User>,
    phone: string
  ): Promise<DocumentType<User> | null> {
    return this.findOne({ phone }).exec();
  }
}

export const UserModel = getModelForClass(User);

export default User;
