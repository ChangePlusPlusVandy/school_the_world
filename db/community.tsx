import * as SQLite from "expo-sqlite";

export interface Community {
  country: String;
  id: number;
  name: String;
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
