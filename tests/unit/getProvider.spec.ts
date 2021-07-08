import { Providers } from '../../src/enums';
import { GetProvider } from '../../src/common/utilities/getProvider';

jest.mock('../../src/providers/DB.provider');
jest.mock('../../src/providers/FS.provider');
jest.mock('../../src/providers/S3.provider');

describe('getProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a DB provider', () => {
    const dbName = 'DBProvider';
    const provider = GetProvider(Providers.DB);
    expect(provider.constructor.name).toBe(dbName);
  });

  it('should return an FS provider', () => {
    const dbName = 'FSProvider';
    const provider = GetProvider(Providers.FS);
    expect(provider.constructor.name).toBe(dbName);
  });

  it('should return a S3 provider', () => {
    const dbName = 'S3Provider';
    const provider = GetProvider(Providers.S3);
    expect(provider.constructor.name).toBe(dbName);
  });
});
