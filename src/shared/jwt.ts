import jwt from 'jsonwebtoken';
import { JWTConfig } from './constants';

interface Payload {
  id: string;
}

export const sign = (payload: Payload, expire: number): string =>
  jwt.sign(payload, JWTConfig.secret, {
    expiresIn: expire,
  });

export default sign;
