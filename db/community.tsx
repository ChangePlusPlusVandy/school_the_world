import * as SQLite from 'expo-sqlite'


export interface Community {
    country: string;
    id: number;
    name: string;
  }

//update the community at id with newCommunity
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