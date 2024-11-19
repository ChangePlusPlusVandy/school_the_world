import * as SQLite from 'expo-sqlite';
import { getEntryById, Entry } from '../db/entry';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('Entry Database Functions', () => {
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

  describe('getEntryById', () => {
    it('should retrieve an entry by its ID successfully', async () => {
      const mockEntry: Entry = {
        id: "entry_123",
        arrival_date: "2024-03-18",
        arrival_time: "09:00",
        time_teachers_arrive: "08:30",
        time_children_leave: "15:00",
        time_classes_start: "09:15",
        time_classes_end: "14:45",
        recess_time: 30,
        num_hours_children: 6,
        num_teachers_absent: 0,
        cleanliness: 5,
        playground_used: true,
        sinks_used: true,
        classroom_decor: "Colorful",
        classrooms_used: true,
        observations: "Great day",
        program_type: "Regular",
        num_children: 20,
        num_parents: 2
      };

      // Mock getFirstAsync to return Entry object with boolean values as integers
      mockDb.getFirstAsync.mockResolvedValue({
        ...mockEntry,
        playground_used: 1,
        sinks_used: 1,
        classrooms_used: 1
      });

      // Call the function
      const result = await getEntryById(mockDb, 'entry_123');

      // Assertions
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM entries WHERE id = ?'),
        ['entry_123']
      );
      expect(result).toEqual(mockEntry);
    });

    it('should return null if the entry is not found', async () => {
      // Mock getFirstAsync to return null, simulating a not-found entry
      mockDb.getFirstAsync.mockResolvedValue(null);

      // Call the function
      const result = await getEntryById(mockDb, 'NonExistentEntry');

      // Assertions
      expect(result).toBeNull();
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM entries WHERE id = ?'),
        ['NonExistentEntry']
      );
    });

    it('should handle retrieval errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock getFirstAsync to throw an error
      mockDb.getFirstAsync.mockRejectedValue(new Error('Retrieval error'));

      // Call the function
      const result = await getEntryById(mockDb, 'entry_123');

      // Assertions
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Error getting entry by id:", expect.any(Error));

      // Restore console error
      consoleSpy.mockRestore();
    });

    it('should convert integer boolean values to actual booleans', async () => {
      const dbResult = {
        id: "entry_123",
        arrival_date: "2024-03-18",
        arrival_time: "09:00",
        time_teachers_arrive: "08:30",
        time_children_leave: "15:00",
        time_classes_start: "09:15",
        time_classes_end: "14:45",
        recess_time: 30,
        num_hours_children: 6,
        num_teachers_absent: 0,
        cleanliness: 5,
        playground_used: 1,
        sinks_used: 0,
        classroom_decor: "Colorful",
        classrooms_used: 1,
        observations: "Great day",
        program_type: "Regular",
        num_children: 20,
        num_parents: 2
      };

      mockDb.getFirstAsync.mockResolvedValue(dbResult);

      const result = await getEntryById(mockDb, 'entry_123');

      expect(result).toEqual({
        ...dbResult,
        playground_used: true,
        sinks_used: false,
        classrooms_used: true
      });
    });
  });
});