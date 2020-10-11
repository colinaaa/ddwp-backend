import { Arg, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import UserService, { UserServiceName } from '@services/user';
import { User } from '@models/user';
import { Error } from 'mongoose';

@Service()
@Resolver(User)
class UserResolver {
  @Inject(UserServiceName)
  private readonly service!: UserService;

  @Query(() => [User], { nullable: true })
  async allUsers(): Promise<User[] | null> {
    return this.service.find();
  }

  @Query(() => User)
  async userByPhone(@Arg('phone') phone: string): Promise<User> {
    const user = await this.service.findByPhone(phone);
    if (!user) {
      throw new Error('not found');
    }
    return user;
  }
}

export default UserResolver;
