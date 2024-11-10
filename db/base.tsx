import * as SQLite from "expo-sqlite"
import { insertCountry, getCountryById } from "./country";
import { insertCommunity} from "./community";

export interface Country{
    id: number,
    name: String
}

export interface Community {
    id: number,
    name: String,
    country: String
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

    async addCommunity(communityName: string, countryName: string): Promise<Community|null> {
        try {
            if (!this.db) throw new Error("Database not initialized");
            return await insertCommunity(this.db, communityName, countryName, this.getCommunityById.bind(this));
        } catch (err) {
            console.error("error adding community: ", err);
            return null
        }
    }

}

export const createDatabase = async () => {
    const dbService = new DatabaseService();
    await dbService.initDatabase();
    return dbService
}