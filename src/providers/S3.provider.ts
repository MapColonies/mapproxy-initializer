import { promises as fsp } from 'fs';
import { S3 } from 'aws-sdk';
import { container } from 'tsyringe';
import { Services } from '../common/constants';
import { IConfig, IFileProvider, IFSConfig, IS3Config } from '../common/interfaces';

export class S3Provider implements IFileProvider {
  private readonly s3Config: IS3Config;
  private readonly fsConfig: IFSConfig;
  private readonly s3: S3;
  private readonly options: S3.GetObjectRequest;
  private readonly config: IConfig;
  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.s3Config = this.config.get<IS3Config>('S3');
    this.fsConfig = this.config.get<IFSConfig>('FS');
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.s3Config.accessKeyId,
        secretAccessKey: this.s3Config.secretAccessKey,
      },
      endpoint: this.s3Config.endpoint,
      s3ForcePathStyle: this.s3Config.forcePathStyle,
    });
    this.options = {
      Bucket: this.s3Config.bucket,
      Key: this.s3Config.fileKey,
    };
  }

  public async getFile(): Promise<void> {
    try {
      const resp = await this.s3.getObject(this.options).promise();
      const content = resp.Body as Buffer;
      const destination = this.fsConfig.destinationFilePath;
      await fsp.writeFile(destination, content);

      console.log(resp);
    } catch (error) {
      console.log(`S3 failed to provied file: ${error}`);
    }
  }
}
