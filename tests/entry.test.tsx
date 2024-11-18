import * as SQLite from "expo-sqlite";
import { DatabaseService, createDatabase } from "@/db/base";
import { Entry } from "../db/entry";

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
