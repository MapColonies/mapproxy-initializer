import { DBProvider } from '../../providers/DB.provider';
import { FSProvider } from '../../providers/FS.provider';
import { S3Provider } from '../../providers/S3.provider';
import { IConfigProvider } from '../interfaces';

export const GetProvider = (provider: string): IConfigProvider => {
  switch (provider.toLowerCase()) {
    case 'fs':
      return new FSProvider();
    case 's3':
      return new S3Provider();
    case 'db':
      return new DBProvider();
    default:
      throw new Error(`Error: provider ${provider} is not a suitable provider.`);
  }
};
