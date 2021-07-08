import { Providers } from '../enums';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
}

export interface IConfigProvider {
  getFile: () => Promise<void>;
}

export interface IServiceConfig {
  provider: Providers;
}

export interface IS3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  bucket: string;
  fileKey: string;
  forcePathStyle: boolean;
}

export interface IFSConfig {
  sourceFilePath: string;
  destinationFilePath: string;
}

export interface IPGSSL {
  ca: string;
  key: string;
  cert: string;
}

export interface IPGConfig {
  host: string;
  user: string;
  database: string;
  password: string;
  port: number;
  sslEnabled: boolean;
  rejectUnauthorized: boolean;
  sslPaths: IPGSSL;
}
