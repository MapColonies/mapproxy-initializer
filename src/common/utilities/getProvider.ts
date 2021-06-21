import { DBProvider } from '../../providers/DB.provider';
import { FSProvider } from '../../providers/FS.provider';
import { S3Provider } from '../../providers/S3.provider';
import { IFileProvider } from '../interfaces';

export const getProvider = (provider: string): IFileProvider => {
  switch (provider) {
    case 'fs':
      return new FSProvider();
    case 's3':
      return new S3Provider();
    case 'db':
      return new DBProvider();
    default:
      return new FSProvider();
  }
};
