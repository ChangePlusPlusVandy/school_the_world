import * as SQLite from 'expo-sqlite'

export interface Community {
   id: number,
   name: String,
   country: String
}

export async function insertCommunity(
    db: SQLite.SQLiteDatabase, 
    id: number,
    communityName: string,
    countryName: string,
    getById: (id: number) => Promise<Community | null>
): Promise<Community | null> {
    const result = await db.runAsync(
        `INSERT INTO communities (_id, name, countryname) VALUES (?, ?)`,
        [id, communityName, countryName]
    );

    if (result.lastInsertRowId) {
        return getById(Number(result.lastInsertRowId));
    }
    
    return null;
}