import * as SQLite from 'expo-sqlite';
import { DatabaseService, Country, createDatabase, Community } from '@/db/base';
import {insertCommunity, deleteCommunityById} from '../db/community'
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
      getAllAsync: jest.fn()
    } as any;
    // Reset the mock and set default return value
    (SQLite.openDatabaseAsync as jest.Mock).mockReset();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
    // Create new instance for each test
    dbService = new DatabaseService();
  });

  describe('addCommunity', () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });
    
    it('should add community successfully', async () => {
      const mockCommunity: Community = { id: 1, name: 'Test Community', country : 'Test Country' };
      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: Number(1),
        changes: Number(1)
      }
      
      mockDb.runAsync.mockResolvedValue(mockRunResult);
      mockDb.getFirstAsync.mockResolvedValue(mockCommunity);

      const result = await insertCommunity(mockDb, mockCommunity.id, 'Test Community', 'Test Country', async (id) => mockCommunity);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `INSERT INTO communities (id, name, countryName) VALUES (?, ?, ?)`,
        [1, "Test Community", "Test Country"]
      );
      expect(result).toEqual(mockCommunity);
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


  //testing for getting all communities by the given country
  describe('getting all communities by country', ()=> {
    beforeEach(async () => {
      await dbService.initDatabase();
      console.log = jest.fn();
    });

    it("should get communities by country successfully", async () => {
      const mockCommunities2: Community[] = [{ id: 1, name: "Test Community 1", country: "USA"},
        {id: 2, name: "Test Community 2", country: "USA"}];

      mockDb.getAllAsync.mockResolvedValue(mockCommunities2);

      const result = await dbService.getCommunitiesByCountry('USA');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        `SELECT * FROM communities WHERE country = ?`,
        ['USA']
      );

      expect(result).toEqual(mockCommunities2);
    });

    //'fake testing'
    it('should return an empty array when the specified country is not detected', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);
      
      const result = await dbService.getCommunitiesByCountry('Mexico');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        `SELECT * FROM communities WHERE country = ?`,
        ['Mexico']
      );
      expect(result).toEqual([]);
    });

    //null case testing
    it('should return null when there is an error during the execution', async () => {
      mockDb.getAllAsync.mockRejectedValue(new Error("Testing the error case: catch block testing..."));

      const result = await dbService.getCommunitiesByCountry('Mexico');
      
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        'Failed to get all communities by country');
    });
  })
})
})