import * as SQLite from "expo-sqlite";
import { DatabaseService, Country, createDatabase } from "@/db/base";
import { Community, deleteCommunityById } from "@/db/community";

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

  describe("deleteCommunityById", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });

    it("should delete community by id successfully", async () => {
      const mockCommunity: Community = {
        country: "China",
        id: 1,
        name: "Test Community",
      };
      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: Number(null),
        changes: Number(1),
      };
      mockDb.getFirstAsync.mockResolvedValue(mockCommunity);
      mockDb.runAsync.mockResolvedValueOnce(mockRunResult);

      const result = await dbService.deleteCommunityById(1);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `DELETE FROM communities WHERE id = ?`,
        [1]
      );
      expect(result).toEqual(mockCommunity);
    });

    it("should return null when community is not found", async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const result = await dbService.deleteCommunityById(999);

      expect(mockDb.runAsync).not.toHaveBeenCalled();

      expect(result).toBeNull();
    });
  });
});
