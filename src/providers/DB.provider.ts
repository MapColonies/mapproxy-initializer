/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { promises as fsp } from 'fs';
import { Client, ClientConfig } from 'pg';
import { container } from 'tsyringe';
import { Services } from '../common/constants';
import { IConfig, IFileProvider, IFSConfig, IPGConfig } from '../common/interfaces';
import { convertJsonToYaml } from '../common/utilities/yamlConvertor';

export class DBProvider implements IFileProvider {
  private readonly config: IConfig;
  private readonly fsConfig: IFSConfig;
  private readonly pgConfig: IPGConfig;
  private readonly pgClientConfig: ClientConfig;
  public constructor() {
    this.config = container.resolve(Services.CONFIG);
    this.pgConfig = this.config.get<IPGConfig>('DB');
    this.fsConfig = this.config.get<IFSConfig>('FS');
    this.pgClientConfig = {
      host: this.pgConfig.host,
      user: this.pgConfig.user,
      database: this.pgConfig.database,
      password: this.pgConfig.password,
      port: this.pgConfig.port,
    };
  }

  public async getFile(): Promise<void> {
    try {
      const pgClient = new Client(this.pgClientConfig);
      await pgClient.connect();

      const jsonContent = await (await pgClient.query('SELECT * FROM config limit 1')).rows[0];
      const yamlContent = convertJsonToYaml(jsonContent);
      const destination = this.fsConfig.destinationFilePath;
      await fsp.writeFile(destination, yamlContent);
      await pgClient.end();
    } catch (error) {
      console.log(`Database failed to provied file: ${error}`);
    }
  }
}
