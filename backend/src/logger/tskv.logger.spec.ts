import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should return TSKV string with required fields', () => {
      const result = logger.formatMessage('log', 'hello');

      expect(result).toContain('tskv\t');
      expect(result).toContain('level=log');
      expect(result).toContain('message=hello');
      expect(result).toContain('timestamp=');
    });

    it('should include optional fields when provided', () => {
      const result = logger.formatMessage(
        'error',
        'failure',
        [{ id: 1 }],
        'AppService',
        'stack trace',
      );

      expect(result).toContain('level=error');
      expect(result).toContain('message=failure');
      expect(result).toContain('context=AppService');
      expect(result).toContain('trace=stack trace');
      expect(result).toContain('optionalParams=[{"id":1}]');
    });

    it('should escape tabs and new lines', () => {
      const result = logger.formatMessage('log', 'hello\tworld\nnext');

      expect(result).toContain('message=hello\\tworld\\nnext');
    });
  });

  describe('log methods', () => {
    it('should call console.log for log()', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('message');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];

      expect(arg).toContain('tskv\t');
      expect(arg).toContain('level=log');
      expect(arg).toContain('message=message');
      expect(arg).toContain('timestamp=');
    });

    it('should call console.warn for warn()', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('warning');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      expect(arg).toContain('level=warn');
      expect(arg).toContain('message=warning');
    });

    it('should call console.debug for debug()', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();

      logger.debug('debug message');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      expect(arg).toContain('level=debug');
      expect(arg).toContain('message=debug message');
    });

    it('should call console.info for verbose()', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      logger.verbose('verbose message');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      expect(arg).toContain('level=verbose');
      expect(arg).toContain('message=verbose message');
    });

    it('should call console.error for error() with trace and context', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('boom', 'stack trace', 'UsersService');

      expect(spy).toHaveBeenCalledTimes(1);

      const [arg] = spy.mock.calls[0];
      expect(arg).toContain('level=error');
      expect(arg).toContain('message=boom');
      expect(arg).toContain('trace=stack trace');
      expect(arg).toContain('context=UsersService');
    });
  });
});
