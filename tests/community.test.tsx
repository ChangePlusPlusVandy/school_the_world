import * as SQLite from "expo-sqlite";
import { DatabaseService, Community, createDatabase } from "@/db/base";

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
    } as any;
    // Reset the mock and set default return value
    (SQLite.openDatabaseAsync as jest.Mock).mockReset();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
    // Create new instance for each test
    dbService = new DatabaseService();
  });

  // Test for editing a community
  describe("edit community", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });
  
    it("should edit community successfully", async () => {
      const mockCommunity: Community = {
        country: "Mock Country",
        id: 1,
        name: "Mock Community",
      };
  
      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: 1, 
        changes: 1,
      };
      mockDb.runAsync.mockResolvedValue(mockRunResult); 

      const result = await dbService.editCommunity(mockCommunity, 1);
  
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `UPDATE communities SET country = ?, name = ? WHERE id = ?`,
        [mockCommunity.country, mockCommunity.name, 1]
      );
  
      expect(result).toEqual(mockCommunity);
    });
  
    // Null case testing when no rows are updated
    it("should return null when community is not found", async () => {
      // Simulate the case where no community with the provided id exists
      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: 0,
        changes: 0,
      };
      mockDb.runAsync.mockResolvedValue(mockRunResult);
  
      const result = await dbService.editCommunity(
        { country: "Nonexistent Country", id: 999, name: "Nonexistent Community" },
        999
      );
  
      // Ensure no update was attempted and the result is null
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `UPDATE communities SET country = ?, name = ? WHERE id = ?`,
        ["Nonexistent Country", "Nonexistent Community", 999]
      );
      expect(result).toBeNull();
    });
  });
});
