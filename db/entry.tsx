import * as SQLite from "expo-sqlite";

export interface Entry {
    id: string;
    arrival_date: string;
    arrival_time: string;
    time_teachers_arrive: string;
    time_children_leave: string;
    time_classes_start: string;
    time_classes_end: string;
    recess_time: number;
    num_hours_children: number;
    num_teachers_absent: number;
    cleanliness: number;
    playground_used: boolean;
    sinks_used: boolean;
    classroom_decor: string;
    classrooms_used: boolean;
    observations: string;
    program_type: string;
    num_children: number;
    num_parents: number;
}

export async function getEntryById(db: SQLite.SQLiteDatabase, id: string): Promise<Entry | null> {
    try {
        const result = await db.getFirstAsync<any>(`
            SELECT * FROM entries WHERE id = ?
        `, [id]);

        if (!result) return null;

        return {
            ...result,
            playground_used: Boolean(result.playground_used),
            sinks_used: Boolean(result.sinks_used),
            classrooms_used: Boolean(result.classrooms_used)
        };
    } catch (error) {
        console.error('Error getting entry by id:', error);
        return null;
    }
}