import { join, dirname } from 'path';
import { promises as fsPromise } from 'fs';
import { S3 } from 'aws-sdk';
import { container } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { Services } from '../common/constants';
import { IConfig, IConfigProvider, IFSConfig, IS3Config } from '../common/interfaces';
import { createLastUpdatedTimeJsonFile } from '../common/utilities/createUpdatedTimeJsonFile';

export class S3Provider implements IConfigProvider {
  private readonly s3Config: IS3Config;
  private readonly fsConfig: IFSConfig;
  private readonly s3: S3;
  private readonly options: S3.GetObjectRequest;
  private readonly config: IConfig;
  private readonly logger: Logger;
  private readonly updatedTimeFileName: string;

  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.logger = container.resolve(Services.LOGGER);
    this.s3Config = this.config.get<IS3Config>('S3');
    this.fsConfig = this.config.get<IFSConfig>('FS');
    this.updatedTimeFileName = this.config.get<string>('updatedTimeFileName');
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.s3Config.accessKeyId,
        secretAccessKey: this.s3Config.secretAccessKey,
      },
      endpoint: this.s3Config.endpoint,
      s3ForcePathStyle: this.s3Config.forcePathStyle,
    });
    this.options = {
      /* eslint-disable @typescript-eslint/naming-convention */
      Bucket: this.s3Config.bucket,
      /* eslint-disable @typescript-eslint/naming-convention */
      Key: this.s3Config.fileKey,
    };
  }

  public async getFile(): Promise<void> {
    try {
      const resp = await this.s3.getObject(this.options).promise();
      const lastUpdatedDate = resp.LastModified;
      const content = resp.Body as Buffer;
      const destination = this.fsConfig.destinationFilePath;
      const updatedTimeJsonFileDest = join(dirname(destination), this.updatedTimeFileName);

      await fsPromise.writeFile(destination, content);
      await createLastUpdatedTimeJsonFile(updatedTimeJsonFileDest, lastUpdatedDate as Date);
    } catch (error) {
      this.logger.error(`S3 failed to provide file.`);
      throw error;
    }
  }
}
