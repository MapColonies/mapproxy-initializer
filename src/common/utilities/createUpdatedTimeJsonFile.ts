import { promises as fsPromise } from 'fs';
import { IUpdatedTimeFileContent } from '../interfaces';

export const createLastUpdatedTimeJsonFile = async (dest: string, timestamp: Date): Promise<void> => {
  const latUpdatedTimeJsonContent: IUpdatedTimeFileContent = {
    updatedTime: timestamp,
  };

  await fsPromise.writeFile(dest, JSON.stringify(latUpdatedTimeJsonContent), {});
};
