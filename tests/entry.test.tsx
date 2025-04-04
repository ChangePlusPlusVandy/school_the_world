import * as SQLite from "expo-sqlite";
import { DatabaseService, createDatabase } from "@/db/base";
import { Entry, getEntrybyArrivalYear, getEntryById } from "../db/entry";

// Mock expo-sqlite
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));

describe("DatabaseService", () => {
  let dbService: DatabaseService;
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    // Create mock database object
    mockDb = {
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn(),
    } as any;

    // Reset the mock and set default return value
    (SQLite.openDatabaseAsync as jest.Mock).mockReset();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);

    // Create new instance for each test
    dbService = new DatabaseService();
  });

  describe('getEntrybyArrivalYear', () => {
    let db: SQLite.SQLiteDatabase;
  
    beforeEach(() => {
      db = {
        getAllAsync: jest.fn()
      } as unknown as SQLite.SQLiteDatabase;
    });
  
    it('should return entries if arrivalYear matches', async () => {
      const mockEntries = [{ id: 1, arrival_date: '2023-10-01', name: 'Test Entry' }];
      (db.getAllAsync as jest.Mock).mockResolvedValue(mockEntries);
  
      const result = await getEntrybyArrivalYear(db, '2023');
      // expect(db.getAllAsync).toHaveBeenCalledWith(`SELECT * FROM entries WHERE arrival_date BETWEEN ? AND ?`, ['2023-01-01', '2023-12-31']);
      expect(result).toEqual(mockEntries);
    });

  
    it('should return multiple entries if arrivalYear matches', async () => {
      const mockEntries = [
        { id: 1, arrival_date: '2023-01-01', name: 'Test Entry One' },
        { id: 2, arrival_date: '2023-10-01', name: 'Test Entry Two' },
        { id: 3, arrival_date: '2023-12-31', name: 'Test Entry Three' },
        { id: 4, arrival_date: '2024-12-31', name: 'Test Entry Four' }
      ];
      const expectedResult = [
        { id: 1, arrival_date: '2023-01-01', name: 'Test Entry One' },
        { id: 2, arrival_date: '2023-10-01', name: 'Test Entry Two' },
        { id: 3, arrival_date: '2023-12-31', name: 'Test Entry Three' }
      ];
      (db.getAllAsync as jest.Mock).mockResolvedValue(mockEntries);
  
      const result = await getEntrybyArrivalYear(db, '2023');
      expect(result).toEqual(expectedResult);
    });
  
    it('should return null if no entries match', async () => {
      const mockEntries = [{ id: 1, arrival_date: '2020-10-01', name: 'Test Entry' }];
      (db.getAllAsync as jest.Mock).mockResolvedValue(mockEntries);
  
      const result = await getEntrybyArrivalYear(db, '2025');
      expect(result).toBeNull();
    });
  
    it('should return null and log an error when there is an exception', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Database error');
      (db.getAllAsync as jest.Mock).mockRejectedValue(mockError);
  
      const result = await getEntrybyArrivalYear(db, '2023');
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error finding entries by arrival year:", mockError);
      expect(result).toBeNull();
  
      consoleErrorSpy.mockRestore();
    });
  });

  describe("deleteEntryById", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });

    it("should delete entry by id successfully", async () => {
      const mockEntry: Entry = {
        id: "entry1",
        arrival_date: "2023-11-17",
        arrival_time: "08:00",
        time_teachers_arrive: "07:45",
        time_children_leave: "15:00",
        time_classes_start: "08:30",
        time_classes_end: "14:30",
        recess_time: "30",
        num_hours_children: "6.5",
        num_teachers_absent: "1",
        cleanliness: "4",
        playground_used: true,
        sinks_used: true,
        classroom_decor: "Colorful posters and student artwork",
        classrooms_used: true,
        observations: "Normal school day, children engaged in activities",
        program_type: "Regular",
        num_children: "30",
        num_parents: "2",
        school: "test_school1",
      };

      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: 0,
        changes: 1,
      };

      mockDb.getFirstAsync.mockResolvedValueOnce(mockEntry);
      mockDb.runAsync.mockResolvedValueOnce(mockRunResult);

      const result = await dbService.deleteEntryById("entry1");

      // Verify database operations
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM entries WHERE id = ? LIMIT 1`,
        ["entry1"]
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `DELETE FROM entries WHERE id = ?`,
        ["entry1"]
      );

      // Verify result
      expect(result).toEqual(mockEntry);
    });

    it("should return null when entry is not found", async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // No entry found
      const result = await dbService.deleteEntryById("999");

      // Verify no deletion was attempted
      expect(mockDb.runAsync).not.toHaveBeenCalled();

      // Verify result
      expect(result).toBeNull();
    });
  });
});

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