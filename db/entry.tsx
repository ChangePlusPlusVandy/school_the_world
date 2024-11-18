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
  school: string;
}

export async function insertEntry(
  db: SQLite.SQLiteDatabase,
  entry: Omit<Entry, "id">, // sqlite generated id
): Promise<Entry | null> {
  try {
    const result = await db.runAsync(
      `INSERT INTO entries (
        arrival_date, arrival_time, time_teachers_arrive, 
        time_children_leave, time_classes_start, time_classes_end, 
        recess_time, num_hours_children, num_teachers_absent, 
        cleanliness, playground_used, sinks_used, 
        classroom_decor, classrooms_used, observations, 
        program_type, num_children, num_parents, school
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.arrival_date,
        entry.arrival_time,
        entry.time_teachers_arrive,
        entry.time_children_leave,
        entry.time_classes_start,
        entry.time_classes_end,
        entry.recess_time,
        entry.num_hours_children,
        entry.num_teachers_absent,
        entry.cleanliness,
        entry.playground_used ? 1 : 0, 
        entry.sinks_used ? 1 : 0,    
        entry.classroom_decor,
        entry.classrooms_used ? 1 : 0, 
        entry.observations,
        entry.program_type,
        entry.num_children,
        entry.num_parents,
        entry.school, 
      ]
    );

    if (result.changes > 0) {
      const id = result.lastInsertRowId.toString(); // id from sqlite

      return { ...entry, id };
    }
  } catch (error) {
    console.error("Error inserting entry:", error);
  }

  return null; 
}