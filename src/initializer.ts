import { inject, injectable } from 'tsyringe';
import { IFileProvider } from './common/interfaces';
import { Services } from './common/constants';

@injectable()
export class Initializer {
  public constructor(@inject(Services.FILE_PROVIDER) private readonly fileProvider: IFileProvider) {}

  public async provide(): Promise<void> {
    try {
      await this.fileProvider.getFile();
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
