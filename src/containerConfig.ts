import { container } from 'tsyringe';
import config from 'config';
import { logMethod } from '@map-colonies/telemetry';
import jsLogger, { LoggerOptions } from '@map-colonies/js-logger';
import { Tracing } from '@map-colonies/telemetry';
import { Services } from './common/constants';
import { IFileProvider, IServiceConfig } from './common/interfaces';
import { GetProvider } from './common/utilities/getProvider';

function registerExternalValues(tracing: Tracing): void {
  const loggerConfig = config.get<LoggerOptions>('logger');
  const serverConfig = config.get<IServiceConfig>('service');
  // @ts-expect-error the signature is wrong
  const logger = jsLogger({ ...loggerConfig, prettyPrint: false, hooks: { logMethod } });
  container.register(Services.CONFIG, { useValue: config });
  container.register(Services.LOGGER, { useValue: logger });
  const tracer = tracing.start();
  container.register(Services.TRACER, { useValue: tracer });
  container.register(Services.FILE_PROVIDER, {
    useFactory: (): IFileProvider => {
      return GetProvider(serverConfig.provider);
    },
  });
  container.register('onSignal', {
    useValue: async (): Promise<void> => {
      await Promise.all([tracing.stop()]);
    },
  });
}

export { registerExternalValues };
