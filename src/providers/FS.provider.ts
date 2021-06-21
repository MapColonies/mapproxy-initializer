import { promises as fsp } from 'fs';
import { container } from 'tsyringe';
import { Services } from '../common/constants';
import { IConfig, IFileProvider, IFSConfig } from '../common/interfaces';

export class FSProvider implements IFileProvider {
  private readonly config: IConfig;
  private readonly fsConfig: IFSConfig;
  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.fsConfig = this.config.get<IFSConfig>('FS');
  }
  public async getFile(): Promise<void> {
    try {
      const source = this.fsConfig.sourceFilePath;
      const destination = this.fsConfig.destinationFilePath;
      await fsp.copyFile(source, destination);
    } catch (error) {
      console.log(`Failed to copy source file: ${error}`);
    }
  }
}
