import * as SQLite from "expo-sqlite";
import { DatabaseService, createDatabase } from "@/db/base";
import { getAllEntriesBySchool, editEntry, Entry, School, insertEntry } from "../db/entry";

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
  describe("getAllEntriesBySchool", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
      console.error = jest.fn();
    });

    it("should get all entries by school successfully", async () => {
      const mockSchool: Omit<School, "entries"> = {
        id: "school1",
        status: "active",
      };
      const mockEntries: Entry[] = [
        {
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
        },
        {
          id: "entry2",
          arrival_date: "2023-11-18",
          arrival_time: "08:15",
          time_teachers_arrive: "08:00",
          time_children_leave: "15:10",
          time_classes_start: "08:35",
          time_classes_end: "14:35",
          recess_time: "25",
          num_hours_children: "6",
          num_teachers_absent: "0",
          cleanliness: "5",
          playground_used: true,
          sinks_used: true,
          classroom_decor: "Educational charts and interactive displays",
          classrooms_used: true,
          observations:
            "Special science fair day, increased parent participation",
          program_type: "Science Fair",
          num_children: "32",
          num_parents: "15",
        },
      ];

      mockDb.getFirstAsync.mockResolvedValue(mockSchool);
      mockDb.getAllAsync.mockResolvedValue(mockEntries);

      const result = await getAllEntriesBySchool(mockDb, "school1");

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE _id = ?`,
        ["school1"]
      );
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        `SELECT * FROM entries WHERE school_id = ?`,
        ["school1"]
      );
      expect(result).toEqual(mockEntries);
    });

    it("should return null when the specified school is not found", async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const result = await getAllEntriesBySchool(mockDb, "nonexistent_school");

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE _id = ?`,
        ["nonexistent_school"]
      );
      expect(result).toBeNull();
    });

    it("should return an empty array when the school exists but has no entries", async () => {
      const mockSchool: Omit<School, "entries"> = {
        id: "school1",
        status: "active",
      };
      mockDb.getFirstAsync.mockResolvedValue(mockSchool);
      mockDb.getAllAsync.mockResolvedValue([]);

      const result = await getAllEntriesBySchool(mockDb, "school1");

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        `SELECT * FROM schools WHERE _id = ?`,
        ["school1"]
      );
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        `SELECT * FROM entries WHERE school_id = ?`,
        ["school1"]
      );
      expect(result).toEqual([]);
    });

    it("should return null when there is an error during the execution", async () => {
      mockDb.getFirstAsync.mockRejectedValue(new Error("Database error"));

      const result = await getAllEntriesBySchool(mockDb, "school1");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Error retrieving school and entries:",
        expect.any(Error)
      );
    });
  });

  describe("editEntry", () => {
    beforeEach(async () => {
      await dbService.initDatabase();
      const mockSchool: Omit<School, "entries"> = {
        id: "school1",
        status: "active",
      };
      const mockEntries: Entry[] = [
        {
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
          num_parents: "2"
        },
        {
          id: "entry2",
          arrival_date: "2023-11-18",
          arrival_time: "08:15",
          time_teachers_arrive: "08:00",
          time_children_leave: "15:10",
          time_classes_start: "08:35",
          time_classes_end: "14:35",
          recess_time: "25",
          num_hours_children: "6",
          num_teachers_absent: "0",
          cleanliness: "5",
          playground_used: true,
          sinks_used: true,
          classroom_decor: "Educational charts and interactive displays",
          classrooms_used: true,
          observations:
            "Special science fair day, increased parent participation",
          program_type: "Science Fair",
          num_children: "32",
          num_parents: "15"
        }
      ];
      mockDb.getFirstAsync.mockResolvedValue(mockSchool);
      mockDb.getAllAsync.mockResolvedValue(mockEntries);
      console.error = jest.fn();
    });

    it("should update an entry by schoolId successfully", async () => {
      const input: Entry = {
        id: "entryTEST",
        arrival_date: "2023-10-18",
        arrival_time: "08:00",
        time_teachers_arrive: "07:45",
        time_children_leave: "15:00",
        time_classes_start: "08:30",
        time_classes_end: "14:00",
        recess_time: "30",
        num_hours_children: "5.5",
        num_teachers_absent: "1",
        cleanliness: "2",
        playground_used: false,
        sinks_used: false,
        classroom_decor: "nothing",
        classrooms_used: false,
        observations:
          "children are happy",
        program_type: "Carnival",
        num_children: "30",
        num_parents: "10"
      }

      const entriesAfter: Entry[] = [
        {
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
          num_parents: "2"
        },
        {
          id: "entryTEST",
          arrival_date: "2023-10-18",
          arrival_time: "08:00",
          time_teachers_arrive: "07:45",
          time_children_leave: "15:00",
          time_classes_start: "08:30",
          time_classes_end: "14:00",
          recess_time: "30",
          num_hours_children: "5.5",
          num_teachers_absent: "1",
          cleanliness: "2",
          playground_used: false,
          sinks_used: false,
          classroom_decor: "nothing",
          classrooms_used: false,
          observations:
            "children are happy",
          program_type: "Carnival",
          num_children: "30",
          num_parents: "10"
        }
      ]

      const result = await editEntry(mockDb, "school1", "entry2", input);
      expect(result).toEqual(input);

      const testingChangesSaved = await getAllEntriesBySchool(mockDb, "school1");
      expect(testingChangesSaved).toEqual(entriesAfter);
    });

    it("should return null when the specified school is not found", async () => {
      const input: Entry = {
        id: "entryTEST",
        arrival_date: "2023-10-18",
        arrival_time: "08:00",
        time_teachers_arrive: "07:45",
        time_children_leave: "15:00",
        time_classes_start: "08:30",
        time_classes_end: "14:00",
        recess_time: "30",
        num_hours_children: "5.5",
        num_teachers_absent: "1",
        cleanliness: "2",
        playground_used: false,
        sinks_used: false,
        classroom_decor: "nothing",
        classrooms_used: false,
        observations:
          "children are happy",
        program_type: "Carnival",
        num_children: "30",
        num_parents: "10"
      }

      const result = await editEntry(mockDb, "nonexistent_school", "entry2", input);
      expect(result).toBeNull();
    });

    it("should return null when the school is valid but the entry name is not", async () => {
      const input: Entry = {
        id: "entryTEST",
        arrival_date: "2023-10-18",
        arrival_time: "08:00",
        time_teachers_arrive: "07:45",
        time_children_leave: "15:00",
        time_classes_start: "08:30",
        time_classes_end: "14:00",
        recess_time: "30",
        num_hours_children: "5.5",
        num_teachers_absent: "1",
        cleanliness: "2",
        playground_used: false,
        sinks_used: false,
        classroom_decor: "nothing",
        classrooms_used: false,
        observations:
          "children are happy",
        program_type: "Carnival",
        num_children: "30",
        num_parents: "10"
      }
      const result = await editEntry(mockDb, "school1", "entry3", input);
      expect(result).toBeNull();
    });

    it("should return null when there is an error during the execution", async () => {
      mockDb.getFirstAsync.mockRejectedValue(new Error("Database error"));

      const input: Entry = {
        id: "entryTEST",
        arrival_date: "2023-10-18",
        arrival_time: "08:00",
        time_teachers_arrive: "07:45",
        time_children_leave: "15:00",
        time_classes_start: "08:30",
        time_classes_end: "14:00",
        recess_time: "30",
        num_hours_children: "5.5",
        num_teachers_absent: "1",
        cleanliness: "2",
        playground_used: false,
        sinks_used: false,
        classroom_decor: "nothing",
        classrooms_used: false,
        observations:
          "children are happy",
        program_type: "Carnival",
        num_children: "30",
        num_parents: "10"
      }

      const result = await editEntry(mockDb, "school1", "entry1", input);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Error retrieving school and entries:",
        expect.any(Error)
      );
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