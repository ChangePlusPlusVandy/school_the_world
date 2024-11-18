import * as SQLite from "expo-sqlite";
import { DatabaseService, createDatabase } from "@/db/base";
import { getAllEntriesBySchool, editEntry, Entry, School } from "../db/entry";

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
