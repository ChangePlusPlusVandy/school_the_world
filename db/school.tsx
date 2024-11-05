import * as SQLite from "expo-sqlite";

export interface School {
    readonly _id: string; // `_id` is a unique identifier for the school
    status: string;       // status can be updated
}

export async function insertSchool(
    db: SQLite.SQLiteDatabase, 
    id: string,
    status: string,
    getById: (id: string) => Promise<School | null>
): Promise<School | null> {
    try {
        const result = await db.runAsync(
            `INSERT INTO schools (_id, status) VALUES (?, ?)`,
            [id, status]
        );

        // Check if insertion was successful
        if (result.changes && result.changes > 0) {
            return await getById(id); // Fetch the newly inserted school by _id
        }
    } catch (error) {
        console.error("Error inserting school:", error);
    }

    return null; // Return null if the insertion failed
}

export async function getSchoolById(
    db: SQLite.SQLiteDatabase, 
    id: string
): Promise<School | null> {
    try {
        const result = await db.getFirstAsync<School>(
            `SELECT * FROM schools WHERE _id = ?`,
            [id]
        );

        return result || null; // Return the result if found, or null if not
    } catch (error) {
        console.error("Error retrieving school by ID:", error);
        return null;
    }
}
