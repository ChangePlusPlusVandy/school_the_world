import * as SQLite from "expo-sqlite"

export interface Country{
    id: number,
    name: String
}

export async function insertCountry(
    db: SQLite.SQLiteDatabase, 
    countryName: string,
    getById: (id: number) => Promise<Country | null>
): Promise<Country | null> {
    const result = await db.runAsync(
        `INSERT INTO countries (name) VALUES (?)`,
        [countryName]
    );

    if (result.lastInsertRowId) {
        return getById(Number(result.lastInsertRowId));
    }
    
    return null;
}

export async function getCountryById(
    db: SQLite.SQLiteDatabase, 
    id: number
): Promise<Country | null> {
    const result = await db.getFirstAsync<Country>(
        `SELECT * FROM countries WHERE id = ?`,
        [id]
    );

    return result || null;
}