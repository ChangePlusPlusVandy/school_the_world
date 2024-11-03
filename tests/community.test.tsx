import * as SQLite from 'expo-sqlite';
import { DatabaseService, Country, createDatabase } from '@/db/base';


// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('DatabaseService', () => {
  let dbService: DatabaseService;
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    // Create mock database object
    mockDb = {
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
    } as any;

    // Reset the mock and set default return value
    (SQLite.openDatabaseAsync as jest.Mock).mockReset();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);

    // Create new instance for each test
    dbService = new DatabaseService();
  });
});