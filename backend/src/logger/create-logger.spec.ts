import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { createLogger } from './create-logger';

describe('createLogger', () => {
  it('should return DevLogger by default', () => {
    const logger = createLogger(undefined);
    expect(logger).toBeInstanceOf(DevLogger);
  });

  it('should return DevLogger for dev', () => {
    const logger = createLogger('dev');
    expect(logger).toBeInstanceOf(DevLogger);
  });

  it('should return JsonLogger for json', () => {
    const logger = createLogger('json');
    expect(logger).toBeInstanceOf(JsonLogger);
  });

  it('should return TskvLogger for tskv', () => {
    const logger = createLogger('tskv');
    expect(logger).toBeInstanceOf(TskvLogger);
  });

  it('should ignore case', () => {
    const logger = createLogger('JSON');
    expect(logger).toBeInstanceOf(JsonLogger);
  });
});
