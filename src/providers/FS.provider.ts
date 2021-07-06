import { promises as fsPromise } from 'fs';
import { Logger } from '@map-colonies/js-logger';
import { container } from 'tsyringe';
import { Services } from '../common/constants';
import { IConfig, IFileProvider, IFSConfig } from '../common/interfaces';

export class FSProvider implements IFileProvider {
  private readonly config: IConfig;
  private readonly fsConfig: IFSConfig;
  private readonly logger: Logger;
  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.logger = container.resolve(Services.LOGGER);
    this.fsConfig = this.config.get<IFSConfig>('FS');
  }
  public async getFile(): Promise<void> {
    try {
      const source = this.fsConfig.sourceFilePath;
      const destination = this.fsConfig.destinationFilePath;
      await fsPromise.copyFile(source, destination);
    } catch (error) {
      this.logger.error(`Failed to copy source file. ${JSON.stringify(error as Error)}`);
    }
  }
}
