import * as SQLite from "expo-sqlite";
import { getEntryById } from "./entry";

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

export class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    async initDatabase(): Promise<void> {
        try {
            this.db = await SQLite.openDatabaseAsync("local.db");

            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS entries(
                    id TEXT PRIMARY KEY,
                    arrival_date TEXT NOT NULL,
                    arrival_time TEXT NOT NULL,
                    time_teachers_arrive TEXT NOT NULL,
                    time_children_leave TEXT NOT NULL,
                    time_classes_start TEXT NOT NULL,
                    time_classes_end TEXT NOT NULL,
                    recess_time INTEGER NOT NULL,
                    num_hours_children INTEGER NOT NULL,
                    num_teachers_absent INTEGER NOT NULL,
                    cleanliness INTEGER NOT NULL,
                    playground_used INTEGER NOT NULL,
                    sinks_used INTEGER NOT NULL,
                    classroom_decor TEXT NOT NULL,
                    classrooms_used INTEGER NOT NULL,
                    observations TEXT NOT NULL,
                    program_type TEXT NOT NULL,
                    num_children INTEGER NOT NULL,
                    num_parents INTEGER NOT NULL
                )
            `);

            console.log("db initialized successfully");
        } catch (err) {
            console.error("error initializing db: ", err)
        }
    }

    async getEntryById(id: string): Promise<Entry|null> {
        try {
            if (!this.db) throw new Error("db not initialized");
            return await getEntryById(this.db, id)
        } catch (err) {
            console.error("error getting entry by id", err);
            return null
        }
    }
}

export const createDatabase = async () => {
    const dbService = new DatabaseService();
    await dbService.initDatabase();
    return dbService
}