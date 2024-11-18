import * as SQLite from "expo-sqlite"
import { insertCountry, getCountryById, deleteCountry } from "./country";
import { insertEntry } from "./entry";

export interface Country{
    id: number,
    name: String
}

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

export class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    async initDatabase(): Promise<void> {
        try {
            this.db = await SQLite.openDatabaseAsync("local.db");


            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS countries(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
                )
            `);

            console.log("db initialized successfully");
        } catch (err) {
            console.error("error initializing db: ", err)
        }
    }
 
    async addCountry(countryName: string): Promise<Country|null> {
        try {
            if (!this.db) throw new Error("Database not initialized");
            return await insertCountry(this.db, countryName, this.getCountryById.bind(this));
        } catch (err) {
            console.error("error adding country: ", err);
            return null
        }
    }

    async getCountryById(id: number): Promise<Country|null> {
        try {
            if (!this.db) throw new Error("db not initialized");
            return await getCountryById(this.db, id)
        } catch (err) {
            console.error("error getting country by id", err);
            return null
        }
    }

    async deleteCountry(id: number): Promise<Country|null> {
        try {
            if (!this.db) throw new Error("Database not initialized");
            return await deleteCountry(this.db, id);
        } catch (err) {
            console.error("error deleting country with given id: ", err);
            return null
        }
    }

    async createEntry(entry: Omit<Entry, "id">): Promise<Entry | null> {
        try {
          if (!this.db) throw new Error("Database not initialized");
          return await insertEntry(this.db, entry);
        } catch (error) {
          console.error("Error creating entry:", error);
          return null;
        }
    }
}

export const createDatabase = async () => {
    const dbService = new DatabaseService();
    await dbService.initDatabase();
    return dbService
}