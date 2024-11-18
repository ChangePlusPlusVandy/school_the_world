import * as SQLite from "expo-sqlite";

export interface Country {
  id: number;
  name: string;
}

export async function insertCountry(
  db: SQLite.SQLiteDatabase,
  countryName: string,
  getById: (id: number) => Promise<Country | null>
): Promise<Country | null> {
  const result = await db.runAsync(`INSERT INTO countries (name) VALUES (?)`, [
    countryName,
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
  await db.runAsync(`UPDATE countries SET name = ? WHERE id = ?`, [
    newCountry.name,
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

    await db.runAsync(`DELETE FROM countries WHERE id = ?`, [id]);
    return country;
  } catch (error) {
    console.error("Failed to delete country");

    return null;
  }
};
