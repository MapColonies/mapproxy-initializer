import { join, dirname } from 'path';
import { promises as fsp } from 'fs';
import { Logger } from '@map-colonies/js-logger';
import { container } from 'tsyringe';
import { Services } from '../common/constants';
import { IConfig, IConfigProvider, IFSConfig } from '../common/interfaces';
import { createLastUpdatedTimeJsonFile } from '../common/utilities/createUpdatedTimeJsonFile';

export class FSProvider implements IConfigProvider {
  private readonly config: IConfig;
  private readonly fsConfig: IFSConfig;
  private readonly logger: Logger;
  private readonly updatedTimeFileName: string;

  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.logger = container.resolve(Services.LOGGER);
    this.fsConfig = this.config.get<IFSConfig>('FS');
    this.updatedTimeFileName = this.config.get<string>('updatedTimeFileName');
  }
  public async getFile(): Promise<void> {
    try {
      const source = this.fsConfig.sourceFilePath;
      const lastUpdatedDate = (await fsp.stat(source)).mtime;
      const destination = this.fsConfig.destinationFilePath;
      const updatedTimeJsonFileDest = join(dirname(destination), this.updatedTimeFileName);

      await fsp.copyFile(source, destination);
      await createLastUpdatedTimeJsonFile(updatedTimeJsonFileDest, lastUpdatedDate);
    } catch (error) {
      this.logger.error(`Failed to copy source file.`);
      throw error;
    }
  }
}
