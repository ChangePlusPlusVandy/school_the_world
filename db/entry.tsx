import * as SQLite from "expo-sqlite";
import UUID from "react-native-uuid";
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
  country: string;
  community: string;
  program: string;
  last_updated: number;
}


export async function getEntryById(
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<Entry | null> {
  try {
    const result = await db.getFirstAsync<any>(
      `SELECT * FROM entries WHERE id = ?`,
      [id]
    );

    if (!result) return null;

    return {
      ...result,
      playground_used: Boolean(result.playground_used),
      sinks_used: Boolean(result.sinks_used),
      classrooms_used: Boolean(result.classrooms_used),
    };
  } catch (error) {
    console.error("Error getting entry by id:", error);
    return null;
  }
}

export async function getEntries(
  db: SQLite.SQLiteDatabase,
  country: string,
  community: string,
  programType: string
): Promise<Entry[] | null> {
  try {
    //get all desired entries 
    const entries = await db.getAllAsync<Entry>(
      `SELECT * FROM entries WHERE country = ? AND community = ? AND program_type = ?`,
      [country, community, programType]
    );
    
    if(entries.length==0) {
      return null;
    }
    return entries;    //return the desired entries
  } catch (error) {
    console.error("Fail to get entries.");
    return null;
  }
};

export async function insertEntry(
  db: SQLite.SQLiteDatabase,

  entry: Omit<Entry, "id">
): Promise<Entry | null> {
  try {
    const now = Date.now();
    const uniqueid = UUID.v4();

    const result = await db.runAsync(
      `INSERT INTO entries (
        id, arrival_date, arrival_time, time_teachers_arrive, 
        time_children_leave, time_classes_start, time_classes_end, 
        recess_time, num_hours_children, num_teachers_absent, 
        cleanliness, playground_used, sinks_used, 
        classroom_decor, classrooms_used, observations, 
        program_type, num_children, num_parents, country, community, program, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uniqueid,
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
        entry.country,
        entry.community,
        entry.program,
        now
      ]
    );

    if (result.changes > 0) {
      const id = result.lastInsertRowId.toString();
      return { ...entry, id };
    }
  } catch (error) {
    console.error("Error inserting entry:", error);
  }

  return null;
}

export const deleteEntryById = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<Entry | null> => {
  try {
    const entry = await db.getFirstAsync<Entry>(
      `SELECT * FROM entries WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!entry) {
      return null;
    }
    await db.runAsync(`DELETE FROM entries WHERE id = ?`, [id]);
    return entry;
  } catch (error) {
    console.error("Fail to delete entry by id.");
    return null;
  }
};

export async function editEntry(
  db: SQLite.SQLiteDatabase,
  entryId: string,
  newEntry: Entry
): Promise<Entry | null> {
  try {
    const now = Date.now();
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
        last_updated = ?
      WHERE id = ?`,
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
        newEntry.playground_used ? 1 : 0,
        newEntry.sinks_used ? 1 : 0,
        newEntry.classroom_decor,
        newEntry.classrooms_used ? 1 : 0,
        newEntry.observations,
        newEntry.program_type,
        newEntry.num_children,
        newEntry.num_parents,
        now,
        entryId
      ]
    );

    if (result.changes > 0) {
      return newEntry;
    }
    return null;
  } catch (error) {
    console.error("Error editing entry:", error);
    return null;
  }
}
