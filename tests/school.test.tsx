import * as SQLite from 'expo-sqlite';
import { insertSchool, getSchoolById, School } from '../db/school';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('School Database Functions', () => {
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    // Create mock database object
    mockDb = {
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
    } as unknown as jest.Mocked<SQLite.SQLiteDatabase>;

    // Reset mock for each test
    jest.resetAllMocks();
  });

  describe('insertSchool', () => {
    it('should insert a school successfully and return the inserted school', async () => {
      const mockSchool: School = { _id: 'School_123', status: 'active' };
      const mockRunResult: { changes: number } = { changes: 1 };

      // Mock runAsync and getFirstAsync responses

      mockDb.getFirstAsync.mockResolvedValue(mockSchool);

      // Call the function
      const result = await insertSchool(mockDb, mockSchool._id, mockSchool.status, async (id) => mockSchool);

      // Assertions

    });

    it('should return null if the insertion fails', async () => {
      const mockRunResult: { changes: number } = { changes: 0 }; // Simulate failed insertion


      // Call the function
      const result = await insertSchool(mockDb, 'School_123', 'active', async (id) => null);

      // Assertions
      expect(result).toBeNull();
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `INSERT INTO schools (_id, status) VALUES (?, ?)`,
        ['School_123', 'active']
      );
    });

    it('should handle insertion errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock runAsync to throw an error
      mockDb.runAsync.mockRejectedValue(new Error('Insertion error'));

      const result = await insertSchool(mockDb, 'School_123', 'active', async (id) => null);

      // Assertions
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Error inserting school:", expect.any(Error));

      // Restore console error
      consoleSpy.mockRestore();
    });
  });

  describe('getSchoolById', () => {
    it('should retrieve a school by its ID successfully', async () => {
      const mockSchool: School = { _id: 'School_123', status: 'active' };

      // Mock getFirstAsync to return a School object
      mockDb.getFirstAsync.mockResolvedValue(mockSchool);

      // Call the function
      const result = await getSchoolById(mockDb, 'School_123');

      // Assertions
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE _id = ?`,
        ['School_123']
      );
      expect(result).toEqual(mockSchool);
    });

    it('should return null if the school is not found', async () => {
      // Mock getFirstAsync to return null, simulating a not-found school
      mockDb.getFirstAsync.mockResolvedValue(null);

      // Call the function
      const result = await getSchoolById(mockDb, 'NonExistentSchool');

      // Assertions
      expect(result).toBeNull();
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE _id = ?`,
        ['NonExistentSchool']
      );
    });

    it('should handle retrieval errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock getFirstAsync to throw an error
      mockDb.getFirstAsync.mockRejectedValue(new Error('Retrieval error'));

      // Call the function
      const result = await getSchoolById(mockDb, 'School_123');

      // Assertions
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Error retrieving school by ID:", expect.any(Error));

      // Restore console error
      consoleSpy.mockRestore();
    });
  });
});
