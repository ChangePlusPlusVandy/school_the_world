import * as SQLite from "expo-sqlite";
import { DatabaseService, createDatabase } from "@/db/base";
import { Entry, insertEntry } from "../db/entry";

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

  describe("insertEntry", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
    });

    it('should insert entry successfully and return the entry with generated id', async () => {
      const mockEntry: Omit<Entry, "id"> = {
        arrival_date: "2024-01-01", 
        arrival_time: "09:15", 
        time_teachers_arrive: "08:45",
        time_children_leave: "16:00", 
        time_classes_start: "09:30",
        time_classes_end: "15:30",
        recess_time: "25", 
        num_hours_children: "7", 
        num_teachers_absent: "2",
        cleanliness: "3",
        playground_used: false,
        sinks_used: true,
        classroom_decor: "decor",
        classrooms_used: false,
        observations: "observation", 
        program_type: "type", 
        num_children: "20", 
        num_parents: "5", 
        school: "school", 
      };
  
      const mockResult = { changes: 1, lastInsertRowId: 67890 }; 
      mockDb.runAsync.mockResolvedValue(mockResult);
  
      const result = await insertEntry(mockDb, mockEntry);
  
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        `INSERT INTO entries (
          arrival_date, arrival_time, time_teachers_arrive, 
          time_children_leave, time_classes_start, time_classes_end, 
          recess_time, num_hours_children, num_teachers_absent, 
          cleanliness, playground_used, sinks_used, 
          classroom_decor, classrooms_used, observations, 
          program_type, num_children, num_parents, school
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mockEntry.arrival_date,
          mockEntry.arrival_time,
          mockEntry.time_teachers_arrive,
          mockEntry.time_children_leave,
          mockEntry.time_classes_start,
          mockEntry.time_classes_end,
          mockEntry.recess_time,
          mockEntry.num_hours_children,
          mockEntry.num_teachers_absent,
          mockEntry.cleanliness,
          mockEntry.playground_used ? 1 : 0, 
          mockEntry.sinks_used ? 1 : 0, 
          mockEntry.classroom_decor,
          mockEntry.classrooms_used ? 1 : 0, 
          mockEntry.observations,
          mockEntry.program_type,
          mockEntry.num_children,
          mockEntry.num_parents,
          mockEntry.school,
        ]
      );
  
      expect(result).toEqual({ ...mockEntry, id: "67890" });
    });
  
    it('should return null if the insertion fails', async () => {
      const mockEntry: Omit<Entry, "id"> = {
        arrival_date: "2024-01-02", 
        arrival_time: "09:30", 
        time_teachers_arrive: "08:50", 
        time_children_leave: "16:15", 
        time_classes_start: "09:45", 
        time_classes_end: "15:45", 
        recess_time: "30", 
        num_hours_children: "6", 
        num_teachers_absent: "1", 
        cleanliness: "4", 
        playground_used: true, 
        sinks_used: false, 
        classroom_decor: "decor2", 
        classrooms_used: true, 
        observations: "observation2",
        program_type: "type2", 
        num_children: "25", 
        num_parents: "8", 
        school: "school2",
      };
  
      const mockResult = { changes: 0, lastInsertRowId: 0}; // failure
      mockDb.runAsync.mockResolvedValue(mockResult);
  
      const result = await insertEntry(mockDb, mockEntry);
  
      expect(result).toBeNull();
    });
  });
});



  
