import * as SQLite from "expo-sqlite";
import {
  insertSchool,
  getSchoolById,
  School,
  getAllSchoolsByCommunityId,
} from "../db/school";

// Mock expo-sqlite
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));

describe("School Database Functions", () => {
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    // Create mock database object
    mockDb = {
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn(), // Ensure getAllAsync is mocked
    } as unknown as jest.Mocked<SQLite.SQLiteDatabase>;

    jest.resetAllMocks(); // Reset mocks before each test
  });

  describe("getAllSchoolsByCommunityId", () => {
    it("should retrieve all schools by community ID successfully", async () => {
      const mockSchools: School[] = [
        { _id: "School_123", status: "active", communityid: 1 },
        { _id: "School_456", status: "inactive", communityid: 1 },
      ];

      // Mock getAllAsync to return an array of School objects
      mockDb.getAllAsync.mockResolvedValue(mockSchools);

      // Call the function
      const result = await getAllSchoolsByCommunityId(mockDb, 1);

      // Assertions
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE communityid = ?`,
        [1]
      );
      expect(result).toEqual(mockSchools);
    });

    it("should return null if no schools are found for the community ID", async () => {
      // Mock getAllAsync to return an empty array, simulating no schools found
      mockDb.getAllAsync.mockResolvedValue([]);

      // Call the function
      const result = await getAllSchoolsByCommunityId(mockDb, 1);

      // Assertions
      expect(result).toEqual([]);
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE communityid = ?`,
        [1]
      );
    });

    it("should handle retrieval errors gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock getAllAsync to throw an error
      mockDb.getAllAsync.mockRejectedValue(new Error("Retrieval error"));

      // Call the function
      const result = await getAllSchoolsByCommunityId(mockDb, 1);

      // Assertions
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error retrieving all schools by community ID:",
        expect.any(Error)
      );

      // Restore console error
      consoleSpy.mockRestore();
    });
  });
});