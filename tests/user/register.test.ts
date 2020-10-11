import request from 'supertest';
import { OK, BAD_REQUEST } from 'http-status-codes';

import app from '../../src/Server';
import { UserModel } from '../../src/database/models/user';

const testUser = {
  username: 'testuser',
  phone: '13123456789',
  password: 'password',
  email: 'foo@bar.com',
};

const api = '/user/register';

describe('POST /user/register', () => {
  beforeAll(async () => {
    return UserModel.deleteMany({
      username: testUser.username,
    });
  });

  afterEach(async () => {
    return UserModel.deleteOne({
      username: testUser.username,
    });
  });

  it('should register', async () => {
    await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(OK, { message: 'success' });

    const user = await UserModel.findByPhone(testUser.phone);

    expect(user).toBeTruthy();
    expect(user).toMatchObject(testUser);
  });

  it('got invalid phone', async () => {
    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({
        ...testUser,
        phone: 1312345678,
      })
      .expect(BAD_REQUEST);

    const { message, stack } = JSON.parse(text);

    expect(message).toBe('phone is invalid');
    expect(stack).toMatch('Error');
  });

  it('user exists', async () => {
    await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(OK, { message: 'success' });

    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(BAD_REQUEST);

    const { message, stack } = JSON.parse(text);

    expect(message).toBe('user exists');
    expect(stack).toMatch('Error');
  });
});
