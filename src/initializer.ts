import { container, inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { IConfig, IFileProvider } from './common/interfaces';
import { Services } from './common/constants';

@injectable()
export class Initializer {
  private readonly logger: Logger;
  private readonly config: IConfig;
  public constructor(@inject(Services.FILE_PROVIDER) private readonly fileProvider: IFileProvider) {
    this.config = container.resolve(Services.CONFIG);
    this.logger = container.resolve(Services.LOGGER);
  }

  public async provide(): Promise<void> {
    try {
      await this.fileProvider.getFile();
      const serviceProvider = String(this.config.get('service.provider')).toUpperCase();
      this.logger.info(`A mapproxy configuration file was succesfully retrieved from ${serviceProvider}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
