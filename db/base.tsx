import * as SQLite from "expo-sqlite";
import {
  insertCountry,
  getCountryById,
  editCountry,
  deleteCountry,
  getAllCountries,
} from "./country";
import {
  insertCommunity,
  editCommunity,
  deleteCommunityByNameAndCountry,
  getCommunityById,
  getAllCommunitiesByCountry,
} from "./community";
import { insertEntry, editEntry, deleteEntryById, getEntryById } from "./entry";

import { Country } from "./country";
import { Community } from "./community";
import { Entry } from "./entry";

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

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS communities(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          country INTEGER NOT NULL
        )
      `)

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS entries(
          id TEXT PRIMARY KEY,
          arrival_date TEXT NOT NULL,
          arrival_time TEXT NOT NULL,
          time_teachers_arrive TEXT NOT NULL,
          time_children_leave TEXT NOT NULL,
          time_classes_start TEXT NOT NULL,
          time_classes_end TEXT NOT NULL,
          recess_time TEXT NOT NULL,
          num_hours_children TEXT NOT NULL,
          num_teachers_absent TEXT NOT NULL,
          cleanliness TEXT NOT NULL,
          playground_used INTEGER NOT NULL,
          sinks_used INTEGER NOT NULL,
          classroom_decor TEXT NOT NULL,
          classrooms_used INTEGER NOT NULL,
          observations TEXT NOT NULL,
          program_type TEXT NOT NULL,
          num_children TEXT NOT NULL,
          num_parents TEXT NOT NULL,
          country INTEGER NOT NULL,
          community INTEGER NOT NULL,
          program TEXT NOT NULL
        )
      `);

      console.log("db initialized successfully");
    } catch (err) {
      console.error("error initializing db: ", err);
    }
  }

  async getEntryById(id: string): Promise<Entry | null> {
    try {
      if (!this.db) throw new Error("db not initialized");
      return await getEntryById(this.db, id);
    } catch (err) {
      console.error("error getting entry by id:", err);
      return null;
    }
  }

  // Keep all existing methods
  async addCountry(countryName: string): Promise<Country | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await insertCountry(
        this.db,
        countryName,
        this.getCountryById.bind(this)
      );
    } catch (err) {
      console.error("error adding country: ", err);
      return null;
    }
  }

  async getCountryById(id: number): Promise<Country | null> {
    try {
      if (!this.db) throw new Error("db not initialized");
      return await getCountryById(this.db, id);
    } catch (err) {
      console.error("error getting country by id", err);
      return null;
    }
  }

  async editCountry(id: number, newCountry: Country): Promise<Country | null> {
    try {
      if (!this.db) throw new Error("db not initialized");
      return await editCountry(this.db, id, newCountry);
    } catch (err) {
      console.error("error editing country: ", err);
      return null;
    }
  }

  async getAllCountries(): Promise<Country[] | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await getAllCountries(this.db);
    } catch (error) {
      console.error("Error getting all countries:", error);
      return null;
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

  async addCommunity(
    communityName: string,
    countryName: string,
    id: string
  ): Promise<Community | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await insertCommunity(
        this.db,
        id,
        communityName,
        countryName,
        this.getCommunityById.bind(this)
      );
    } catch (err) {
      console.error("error adding community: ", err);
      return null;
    }
  }

  async getCommunityById(id: number): Promise<Community | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await getCommunityById(this.db, id);
    } catch (err) {
      console.error("error getting community");
      return null;
    }
  }

  async editCommunity(
    newCommunity: Community,
    id: number
  ): Promise<Community | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await editCommunity(this.db, newCommunity, id);
    } catch (err) {
      console.error("Error updating community by id:", err);
      return null;
    }
  }

  async deleteCommunity(name: string, country: string): Promise<Community | null> {
    try {
      if (!this.db) throw new Error("db not initialized");
      return await deleteCommunityByNameAndCountry(this.db, name, country);
    } catch (err) {
      console.error("error getting country by id", err);
      return null;
    }
  }

  async deleteCountry(id: number): Promise<Country | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await deleteCountry(this.db, id);
    } catch (err) {
      console.error("error deleting country with given id: ", err);
      return null;
    }
  }

  async getCommunitiesByCountry(country: string): Promise<Community[] | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await getAllCommunitiesByCountry(this.db, country);
    } catch (error) {
      console.error("error getting all communities by country: ", error);
      return null;
    }
  }

  async editEntry(
    schoolId: string,
    entryId: string,
    newEntry: Entry
  ): Promise<Entry | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await editEntry(this.db, entryId, newEntry);
    } catch (err) {
      console.error("Error editing entry by schoolId:", err);
      return null;
    }
  }

  async deleteEntryById(id: string): Promise<Entry | null> {
    try {
      if (!this.db) throw new Error("db not initialized");
      return await deleteEntryById(this.db, id);
    } catch (err) {
      console.error("error getting entry by id", err);
      return null;
    }
  }
}

export const createDatabase = async () => {
  const dbService = new DatabaseService();
  await dbService.initDatabase();
  return dbService;
};
