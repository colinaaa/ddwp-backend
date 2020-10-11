import request from 'supertest';
import { OK, BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes';

import app from '../../src/Server';
import { UserModel } from '../../src/database/models/user';

const testUser = {
  username: 'testuser',
  phone: '13123456789',
  password: 'password',
  email: 'foo@bar.com',
};

const api = '/user/login';

describe('POST /user/login', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({
      username: testUser.username,
    });

    await UserModel.create(testUser);
  });

  it('should login', async () => {
    const { username, password } = testUser;
    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({
        username,
        password,
      })
      .expect(OK);

    const { token } = JSON.parse(text);

    expect(token).toBeTruthy();
  });

  it('should not login', async () => {
    const { username } = testUser;
    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({
        username,
        password: 'invalid password',
      })
      .expect(BAD_REQUEST);

    const { message, stack } = JSON.parse(text);

    expect(message).toBe('password invalid');
    expect(stack).toMatch('Error');
  });

  it('got invalid usename', async () => {
    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({
        username: 'foo',
        password: 'bar',
      })
      .expect(UNAUTHORIZED);

    const { message, stack } = JSON.parse(text);

    expect(message).toBe('user not found');
    expect(stack).toMatch('Error');
  });

  it('required username', async () => {
    const { password } = testUser;

    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({
        password,
      })
      .expect(BAD_REQUEST);

    const { message, stack } = JSON.parse(text);

    expect(message).toBe('Username is required');
    expect(stack).toMatch('Error');
  });

  it('required password', async () => {
    const { username } = testUser;

    const { text } = await request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({
        username,
      })
      .expect(BAD_REQUEST);

    const { message, stack } = JSON.parse(text);

    expect(message).toBe('Password is required');
    expect(stack).toMatch('Error');
  });
});
