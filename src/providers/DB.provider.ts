/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { dirname, join } from 'path';
import { promises as fsPromise, readFileSync } from 'fs';
import { Client, ClientConfig } from 'pg';
import { container } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { Services } from '../common/constants';
import { IConfig, IConfigProvider, IFSConfig, IPGConfig } from '../common/interfaces';
import { convertJsonToYaml } from '../common/utilities/yamlConvertor';
import { createLastUpdatedTimeJsonFile } from '../common/utilities/createUpdatedTimeJsonFile';

export class DBProvider implements IConfigProvider {
  private readonly config: IConfig;
  private readonly fsConfig: IFSConfig;
  private readonly pgConfig: IPGConfig;
  private readonly logger: Logger;
  private readonly pgClientConfig: ClientConfig;
  private readonly updatedTimeFileName: string;

  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.logger = container.resolve(Services.LOGGER);
    this.pgConfig = this.config.get<IPGConfig>('DB');
    this.fsConfig = this.config.get<IFSConfig>('FS');
    this.pgClientConfig = this.createConnectionOptions(this.pgConfig);
    this.updatedTimeFileName = this.config.get<string>('updatedTimeFileName');
  }

  public async getFile(): Promise<void> {
    const pgClient = new Client(this.pgClientConfig);
    try {
      await pgClient.connect();

      const jsonContent = (await pgClient.query('SELECT * FROM config ORDER BY updated_time DESC limit 1')).rows[0];
      const yamlContent = convertJsonToYaml(jsonContent?.data);
      const updatedTime = jsonContent.updated_time;
      const destination = this.fsConfig.destinationFilePath;
      const updatedTimeJsonFileDest = join(dirname(destination), this.updatedTimeFileName);

      await fsPromise.writeFile(destination, yamlContent);
      await createLastUpdatedTimeJsonFile(updatedTimeJsonFileDest, updatedTime);
    } catch (error) {
      this.logger.error(`Database failed to provide file.`);
      throw error;
    } finally {
      await pgClient.end();
    }
  }

  private createConnectionOptions(dbConfig: IPGConfig): ClientConfig {
    const { sslEnabled, sslPaths, ...connectionOptions } = dbConfig;
    const pgConnection: ClientConfig = connectionOptions;
    if (sslEnabled) {
      pgConnection.ssl = { key: readFileSync(sslPaths.key), cert: readFileSync(sslPaths.cert), ca: readFileSync(sslPaths.ca) };
    }
    return pgConnection;
  }
}
