import { User } from '@models/user';

export const UserServiceName = 'UserService';

export interface IUserService {
  /**
   * find - find a user by condition
   * @async
   * @param cond the condtion for find
   */
  find(cond?: Partial<User>): Promise<User[] | null>;
  findByPhone(phone: string): Promise<User | null>;
}

export default IUserService;
