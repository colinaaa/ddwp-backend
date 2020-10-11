import { BAD_REQUEST } from 'http-status-codes';

type ErrorType = 'debug' | 'info' | 'warn' | 'error';

/**
 * ErrorMessage - the interface for error
 * @interface
 * @implements {Error}
 */
interface ErrorMessage {
  message: string;
  type: ErrorType;
  status: number;
  stack?: string;
}

const errorMsg = (
  message: string,
  type: ErrorType = 'error',
  status = BAD_REQUEST,
  stack = new Error().stack
): ErrorMessage => ({
  message,
  type,
  status,
  stack,
});

export default errorMsg;
