import { container, inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { IConfig, IConfigProvider } from './common/interfaces';
import { Services } from './common/constants';

@injectable()
export class Initializer {
  private readonly logger: Logger;
  private readonly config: IConfig;
  public constructor(@inject(Services.CONFIG_PROIVDER) private readonly configProvider: IConfigProvider) {
    this.config = container.resolve(Services.CONFIG);
    this.logger = container.resolve(Services.LOGGER);
  }

  public async provide(): Promise<void> {
    try {
      await this.configProvider.getFile();
      /* eslint-disable @typescript-eslint/naming-convention */
      const serviceProvider = String(this.config.get('service.provider')).toUpperCase();
      this.logger.info(`A mapproxy configuration file was succesfully retrieved from ${serviceProvider}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
