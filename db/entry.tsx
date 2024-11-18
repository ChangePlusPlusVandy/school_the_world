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
