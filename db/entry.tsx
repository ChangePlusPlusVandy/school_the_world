import * as SQLite from "expo-sqlite";

export interface Entry {
  id: string;
  arrival_date: string;
  arrival_time: string;
  time_teachers_arrive: string;
  time_children_leave: string;
  time_classes_start: string;
  time_classes_end: string;
  recess_time: string;
  num_hours_children: string;
  num_teachers_absent: string;
  cleanliness: string;
  playground_used: boolean;
  sinks_used: boolean;
  classroom_decor: string;
  classrooms_used: boolean;
  observations: string;
  program_type: string;
  num_children: string;
  num_parents: string;
}

export interface School {
  id: string;
  status: string;
  entries: Entry[];
}

export async function getAllEntriesBySchool(
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<Entry[] | null> {
  try {
    // First, get the school information
    const school = await db.getFirstAsync<Omit<School, "entries">>(
      `SELECT * FROM schools WHERE _id = ?`,
      [id]
    );

    if (!school) {
      return null; // School not found
    }

    // Then, get all entries associated with this school
    const entries = await db.getAllAsync<Entry>(
      `SELECT * FROM entries WHERE school_id = ?`,
      [id]
    );

    return entries;
  } catch (error) {
    console.error("Error retrieving school and entries:", error);
    return null;
  }
}

export async function editEntry(
  db: SQLite.SQLiteDatabase,
  schoolId: string,
  entryId: string,
  newEntry: Entry
): Promise<Entry | null> {
  try {
    const result = await db.runAsync(
      `UPDATE entries SET
        arrival_date = ?,
        arrival_time = ?,
        time_teachers_arrive = ?,
        time_children_leave = ?,
        time_classes_start = ?,
        time_classes_end = ?,
        recess_time = ?,
        num_hours_children = ?,
        num_teachers_absent = ?,
        cleanliness = ?,
        playground_used = ?,
        sinks_used = ?,
        classroom_decor = ?,
        classrooms_used = ?,
        observations = ?,
        program_type = ?,
        num_children = ?,
        num_parents = ?,
      WHERE id = ? AND school_id = ?`,
      [
        newEntry.arrival_date,
        newEntry.arrival_time,
        newEntry.time_teachers_arrive,
        newEntry.time_children_leave,
        newEntry.time_classes_start,
        newEntry.time_classes_end,
        newEntry.recess_time,
        newEntry.num_hours_children,
        newEntry.num_teachers_absent,
        newEntry.cleanliness,
        newEntry.playground_used,
        newEntry.sinks_used,
        newEntry.classroom_decor,
        newEntry.classrooms_used,
        newEntry.observations,
        newEntry.program_type,
        newEntry.num_children,
        newEntry.num_parents,
        entryId,
        schoolId
      ]
    );
  
    if (result.changes > 0) {
      return newEntry; 
    }
  
    return null;
  }
}