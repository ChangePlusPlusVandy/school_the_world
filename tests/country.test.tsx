import * as SQLite from "expo-sqlite";
import { DatabaseService, Country, createDatabase } from "@/db/base";

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

  describe("initDatabase", () => {
    it("should initialize database successfully", async () => {
      const consoleSpy = jest.spyOn(console, "log");

      await dbService.initDatabase();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("local.db");
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS countries")
      );
      expect(consoleSpy).toHaveBeenCalledWith("db initialized successfully");
    });

    it("should handle initialization errors", async () => {
      const error = new Error("Database initialization failed");
      (SQLite.openDatabaseAsync as jest.Mock).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, "error");

      await dbService.initDatabase();

      expect(consoleSpy).toHaveBeenCalledWith("error initializing db: ", error);
    });
  });

  describe("addCountry", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });

    it("should add country successfully", async () => {
      const mockCountry: Country = { id: 1, name: "Test Country" };
      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: Number(1),
        changes: Number(1),
      };

      mockDb.runAsync.mockResolvedValue(mockRunResult);
      mockDb.getFirstAsync.mockResolvedValue(mockCountry);

      const result = await dbService.addCountry("Test Country");

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `INSERT INTO countries (name) VALUES (?)`,
        ["Test Country"]
      );
      expect(result).toEqual(mockCountry);
    });

    it("should return null when insertion fails", async () => {
      const result = await dbService.addCountry("Test Country");

      expect(result).toBeNull();
    });
  });

  describe("getCountryById", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });

    it("should get country by id successfully", async () => {
      const mockCountry: Country = { id: 1, name: "Test Country" };
      mockDb.getFirstAsync.mockResolvedValue(mockCountry);

      const result = await dbService.getCountryById(1);

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM countries WHERE id = ?`,
        [1]
      );
      expect(result).toEqual(mockCountry);
    });

    it("should return null when country is not found", async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const result = await dbService.getCountryById(999);

      expect(result).toBeNull();
    });
  });


  describe("createDatabase", () => {
    it("should create and initialize database instance", async () => {
      const dbService = await createDatabase();

      expect(dbService).toBeInstanceOf(DatabaseService);
      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("local.db");
    });
  });
  
   describe("deleteCountry", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });

    it("should delete country by id successfully", async () => {
      const mockCountry: Country = { id: 1, name: "Test Country",};
      const mockRunResult: SQLite.SQLiteRunResult = {
        lastInsertRowId: Number(null),
        changes: Number(1),
      };

      mockDb.runAsync.mockResolvedValueOnce(mockRunResult);
      mockDb.getFirstAsync.mockResolvedValue(mockCountry);
      
      const result = await dbService.deleteCountry(1);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `DELETE FROM countries WHERE id = ?`,
        [1]
      );

      expect(result).toEqual(mockCountry);
    });
    it("should return null when deletion fails", async () => {

      mockDb.getFirstAsync.mockResolvedValue(null);
      const result = await dbService.deleteCountry(999);
      expect(mockDb.runAsync).not.toHaveBeenCalled();
      expect(result).toBeNull();
      
    });
  });
})

