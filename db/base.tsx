import * as SQLite from "expo-sqlite";
import {
  insertCountry,
  getCountryById,
  editCountry,
  deleteCountry,
} from "./country";
import {
  insertCommunity,
  editCommunity,
  deleteCommunityById,
  getCommunityById,
  getAllCommunitiesByCountry,
} from "./community";
import { getAllEntriesBySchool } from "./entry";

export interface Country {
  id: number;
  name: string;
}

export interface Community {
  id: number;
  name: string;
  country: string;
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
      console.error("error initializing db: ", err);
    }
  }

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

  async addCommunity(
    communityName: string,
    countryName: string,
    id: number
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

  async deleteCommunityById(id: number): Promise<Community | null> {
    try {
      if (!this.db) throw new Error("db not initialized");
      return await deleteCommunityById(this.db, id);
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

  async getAllEntriesBySchool(schoolId: string): Promise<Entry[] | null> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      return await getAllEntriesBySchool(this.db, schoolId);
    } catch (error) {
      console.error("error getting all entries by school: ", error);
      return null;
    }
  }
}

export const createDatabase = async () => {
  const dbService = new DatabaseService();
  await dbService.initDatabase();
  return dbService;
};
