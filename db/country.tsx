import * as SQLite from "expo-sqlite";
import { Entry } from "./entry";

export interface Country {
  id: number;
  name: string;
}

export async function insertCountry(
  db: SQLite.SQLiteDatabase,
  countryName: string,
  getById: (id: number) => Promise<Country | null>
): Promise<Country | null> {
  const now = Date.now();
  const result = await db.runAsync(`INSERT INTO countries (name, last_updated) VALUES (?, ?)`, [
    countryName,
    now
  ]);

  if (result.lastInsertRowId) {
    return getById(Number(result.lastInsertRowId));
  }

  return null;
}

export async function getCountryById(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<Country | null> {
  const result: Country | null = await db.getFirstAsync<Country>(
    `SELECT * FROM countries WHERE id = ?`,
    [id]
  );

  return result || null;
}

export async function editCountry(
  db: SQLite.SQLiteDatabase,
  id: number,
  newCountry: Country
): Promise<Country> {
  const now = Date.now();
  await db.runAsync(`UPDATE countries SET name = ?, last_updated = ? WHERE id = ?`, [
    newCountry.name,
    now,
    id,
  ]);
  return newCountry;
}

export const deleteCountry = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<Country | null> => {
  try {
    const country = await db.getFirstAsync<Country>(
      `SELECT 1 FROM countries WHERE id = ? LIMIT 1`,
      [id]
    );
    
    if (!country) {
      return null;
    }


    await db.runAsync(`DELETE FROM countries WHERE id = ?`, [id]);      //delete the country from the country table
    await db.runAsync(                //delete all entries relevant to the given country 
      `DELETE FROM entries WHERE country = ?`,
      [country.name]
    )
    await db.runAsync(
      'DELETE FROM communities WHERE country = ?',
      [country.name]                   //delete all communities relevant to the given country
    )
    
    await db.runAsync(
      `INSERT INTO deleted_countries (id) VALUES (?) `,
      [id]
    )
    return country;
  } catch (error) {
    console.error("Failed to delete country");
    return null;
  }
};

export async function getAllCountries(
  db: SQLite.SQLiteDatabase
): Promise<Country[]> {
  try {
    const countries = await db.getAllAsync<Country>(
      `SELECT * FROM countries ORDER BY name ASC`
    );
    
    return countries || [];
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return [];
  }
}