import * as SQLite from 'expo-sqlite'


export interface Community {
   id: number,
   name: String,
   country: String
}


export async function getCommunityById(
   db: SQLite.SQLiteDatabase,
   id: number
): Promise<Community | null> {
   const result = await db.getFirstAsync<Community | null>(
       `SELECT * FROM communities WHERE id = ?`,
       [id]
   );

   return result || null;
}