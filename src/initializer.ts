import { container, inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { IFileProvider } from './common/interfaces';
import { Services } from './common/constants';

@injectable()
export class Initializer {
  private readonly logger: Logger;
  public constructor(@inject(Services.FILE_PROVIDER) private readonly fileProvider: IFileProvider) {
    this.logger = container.resolve(Services.LOGGER);
  }

  public async provide(): Promise<void> {
    try {
      await this.fileProvider.getFile();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
