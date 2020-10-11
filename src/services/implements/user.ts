import { Container, Service } from 'typedi';

import logger from '@shared/Logger';
import { User, UserModel } from '@models/user';

import { IUserService, UserServiceName } from '../user';

@Service(UserServiceName)
class UserService implements IUserService {
  private readonly model = UserModel;

  async findByPhone(phone: string) {
    return this.model.findByPhone(phone);
  }

  async find(cond: Partial<User> = {}) {
    return this.model.find(cond);
  }
}

logger.info('Register UserSerivce');
Container.set(UserServiceName, new UserService());
