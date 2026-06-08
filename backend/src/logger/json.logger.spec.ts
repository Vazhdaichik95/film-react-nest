import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should return valid JSON string with required fields', () => {
      const result = logger.formatMessage('log', 'hello');

      const parsed = JSON.parse(result);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('hello');
      expect(parsed.timestamp).toEqual(expect.any(String));
    });

    it('should include optional fields when provided', () => {
      const result = logger.formatMessage(
        'error',
        'failure',
        [{ id: 1 }],
        'AppService',
        'stack trace',
      );

      const parsed = JSON.parse(result);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('failure');
      expect(parsed.context).toBe('AppService');
      expect(parsed.trace).toBe('stack trace');
      expect(parsed.optionalParams).toEqual([{ id: 1 }]);
    });
  });

  describe('log methods', () => {
    it('should call console.log for log()', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('message', { foo: 'bar' });

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      const parsed = JSON.parse(arg);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('message');
      expect(parsed.optionalParams).toEqual([{ foo: 'bar' }]);
    });

    it('should call console.warn for warn()', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('warning');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      const parsed = JSON.parse(arg);

      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('warning');
    });

    it('should call console.debug for debug()', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();

      logger.debug('debug message');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      const parsed = JSON.parse(arg);

      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('debug message');
    });

    it('should call console.info for verbose()', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      logger.verbose('verbose message');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      const parsed = JSON.parse(arg);

      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('verbose message');
    });

    it('should call console.error for error() with trace and context', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('boom', 'stack trace', 'UsersService');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      const parsed = JSON.parse(arg);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('boom');
      expect(parsed.trace).toBe('stack trace');
      expect(parsed.context).toBe('UsersService');
    });
  });
});
