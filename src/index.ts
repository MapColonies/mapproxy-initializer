/* eslint-disable import/first */
// this import must be called before the first import of tsyring
import 'reflect-metadata';
import { Tracing } from '@map-colonies/telemetry';
import { Logger } from '@map-colonies/js-logger';
import { container } from 'tsyringe';
import { Services } from './common/constants';
import { registerExternalValues } from './containerConfig';
import { Initializer } from './initializer';
import { IConfigProvider } from './common/interfaces';

async function run(logger: Logger): Promise<void> {
  try {
    const provider = container.resolve(Services.CONFIG_PROIVDER);
    const initializer = new Initializer(provider as IConfigProvider);
    await initializer.provide();
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
  }
}

function main(): void {
  const tracing = new Tracing('mapproxy-initializer');
  registerExternalValues(tracing);
  const logger = container.resolve<Logger>(Services.LOGGER);
  void run(logger).catch((err) => {
    const error = err as Error;
    logger.error(error.message);
  });

  void tracing.stop();
}

main();
