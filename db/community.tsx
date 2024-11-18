import * as SQLite from "expo-sqlite";

export interface Community {
  id: number;
  name: string;
  country: string;
}

export async function insertCommunity(
  db: SQLite.SQLiteDatabase,
  id: number,
  communityName: string,
  countryName: string,
  getById: (id: number) => Promise<Community | null>
): Promise<Community | null> {
  const result = await db.runAsync(
    `INSERT INTO communities (id, name, countryName) VALUES (?, ?, ?)`,
    [id, communityName, countryName]
  );

  if (result.lastInsertRowId) {
    return getById(Number(result.lastInsertRowId));
  }

  return null;
}

export async function editCommunity(
  db: SQLite.SQLiteDatabase,
  newCommunity: Community,
  id: number
): Promise<Community | null> {
  const result = await db.runAsync(
    `UPDATE communities SET country = ?, name = ? WHERE id = ?`,
    [newCommunity.country, newCommunity.name, id]
  );

  if (result.changes > 0) {
    return newCommunity;
  }

  return null;
}

export const deleteCommunityById = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<Community | null> => {
  try {
    const community = await db.getFirstAsync<Community>(
      `SELECT 1 FROM communities WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!community) {
      return null;
    }
    await db.runAsync(`DELETE FROM communities WHERE id = ?`, [id]);
    return community;
  } catch (error) {
    console.error("Fail to delete community by id.");
    return null;
  }
};

export async function getCommunityById(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<Community | null> {
  const result = await db.getFirstAsync<Community>(
    `SELECT * FROM communities WHERE id = ?`,
    [id]
  );

  return result || null;
}

export async function getAllCommunitiesByCountry(
  db: SQLite.SQLiteDatabase,
  country: string
): Promise<Community[] | null> {
  try {
    const results = await db.getAllAsync<Community>(
      "SELECT * FROM communities WHERE country = ?",
      [country]
    );
    return results;
  } catch (error) {
    console.log("Failed to get all communities by country");
    return null;
  }
}
