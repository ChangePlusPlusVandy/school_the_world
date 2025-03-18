import * as SQLite from 'expo-sqlite';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Constants from "expo-constants";

export interface Country {
  id: number;
  name: string;
  last_updated: number;
}

export interface Community {
  id: number;
  name: string;
  country: string;
  last_updated: number;
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
  country: string;
  community: string;
  program: string;
  last_updated: number;
}

interface AppMetadataRow {
  value: string; // Assuming `value` is stored as a string in SQLite
}

// Firestore config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey ?? "",
  authDomain: Constants.expoConfig?.extra?.authDomain ?? "",
  projectId: Constants.expoConfig?.extra?.projectId ?? "",
  storageBucket: Constants.expoConfig?.extra?.storageBucket ?? "",
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId ?? "",
  appId: Constants.expoConfig?.extra?.appId ?? ""
};

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Firebase v9 style firestore initialization
const firestore = getFirestore();

export class FirebaseSync {
  // Flag to track sync operation
  private isSyncing = false;
  private db: SQLite.SQLiteDatabase | null = null;
  
  // Initialize the database connection
  public async initDatabase() {
    this.db = await SQLite.openDatabaseAsync('local.db');
    return this.db;
  }
  
  // Get local database connection
  public getLocalDB() {
    if (!this.db) {
      throw new Error("Database not initialized. Call initDatabase first.");
    }
    return this.db;
  }
  
  // Check network status
  private async isOnline(): Promise<boolean> {
    const networkState = await NetInfo.fetch();
    return networkState.isConnected ?? false;
  }
  
  // Get data from SQLite
  private async getLocalData(table: string, last_sync: number): Promise<any[]> {
    const db = this.getLocalDB();
    
    try {
        const result = await db.getAllAsync(`SELECT * FROM ${table} WHERE last_updated > ?`, [last_sync]);

        return result.length > 0 ? result : [];
    } catch (error) {
        console.error(`Error getting data from ${table}:`, error);
        return []; // Return empty array instead of throwing
    }
  }

  private async upsertLocalData(table: string, data: any): Promise<void> {
    const db = this.getLocalDB();
    
    // Prepare column names and placeholders for SQL
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const updatePairs = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);

    try {
        // Fixed: Correctly handle the values array for both insert and update parts
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) 
                    ON CONFLICT(id) DO UPDATE SET ${updatePairs}`;
                    
        // Add values once for INSERT and once for UPDATE
        await db.runAsync(query, [...values, ...values] as SQLite.SQLiteBindParams);
    } catch (error) {
        console.error(`Error upserting data to ${table}:`, error);
        throw error;
    }
  }

  // Sync countries data
  private async syncCountries(lastSyncTime: number): Promise<void> {
    try {
        // Upload local changes to Firestore (using Firebase v9 style)
        const localCountries = await this.getLocalData('countries', lastSyncTime);
        
        // Upload each country to Firestore
        for (const country of localCountries) {
          await setDoc(doc(firestore, 'countries', country.id.toString()), country, { merge: true });
        }

        // Download changes from Firestore and upsert to local DB
        let firestoreQuery;
        if (lastSyncTime > 0) {
          firestoreQuery = query(
              collection(firestore, 'countries'),
              where('last_updated', '>', lastSyncTime)
          );
        } else {
          firestoreQuery = collection(firestore, 'countries');
        }

        // Get the snapshot of Firestore data
        const snapshot = await getDocs(firestoreQuery);
        
        // Iterate over Firestore data and upsert it to the local database
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const countryData: Country = {
              id: Number(docSnap.id),
              name: data.name,
              last_updated: data.last_updated,
          };

          // Check if required fields are present
          if (!countryData.name || !countryData.last_updated) {
              console.warn(`Skipping country ${docSnap.id} due to missing required fields.`);
              continue;
          }

          await this.upsertLocalData('countries', countryData);
        }
    } catch (error) {
        console.error('Error syncing countries:', error);
        // Don't throw here, to allow sync to continue with other types
    }
  }
  
  private async syncCommunities(lastSyncTime: number): Promise<void> {
    try {
        // Upload local changes to Firestore
        const localCommunities = await this.getLocalData('communities', lastSyncTime);
        
        for (const community of localCommunities) {
          console.log(community);
            await setDoc(
                doc(firestore, 'countries', community.country.toString(), 'communities', community.id.toString()),
                community,
                { merge: true }
            );
        }
        
        // Download ALL changes from Firestore directly
        // First, get all country documents from Firestore
        const countriesSnapshot = await getDocs(collection(firestore, 'countries'));
        
        // For each country, get all communities updated since lastSyncTime
        for (const countryDoc of countriesSnapshot.docs) {
            const countryId = countryDoc.id;
            const countryData = countryDoc.data();
            
            let firestoreQuery;
            if (lastSyncTime > 0) {
                firestoreQuery = query(
                    collection(firestore, 'countries', countryId, 'communities'),
                    where('last_updated', '>', lastSyncTime)
                );
            } else {
                firestoreQuery = collection(firestore, 'countries', countryId, 'communities');
            }

            const communitiesSnapshot = await getDocs(firestoreQuery);
            
            for (const docSnap of communitiesSnapshot.docs) {
                const data = docSnap.data();
                const communityData: Community = {
                    id: Number(docSnap.id),
                    country: countryData.name || countryId, // Use country name or ID as fallback
                    name: data.name,
                    last_updated: data.last_updated
                };

                // Check if required fields are present
                if (!communityData.name || !communityData.last_updated) {
                    console.warn(`Skipping community ${docSnap.id} due to missing required fields.`);
                    continue;
                }

                // Upsert community to local DB
                await this.upsertLocalData('communities', communityData);
            }
        }
    } catch (error) {
        console.error('Error syncing communities:', error);
        // Don't throw here, to allow sync to continue with other entries
    }
  }

  // Sync entries data
  private async syncEntries(lastSyncTime: number): Promise<void> {
    try {
        // Upload local changes to Firestore
        const localEntries = await this.getLocalData('entries', lastSyncTime);

        for (const entry of localEntries) {
            try {
                // Find the community and its corresponding country
                const db = this.getLocalDB();
                const rows = await db.getAllAsync(
                    'SELECT * FROM communities WHERE name = ? AND country = ?',
                    [entry.community, entry.country]  // Ensure community and country match
                );

                if (rows.length === 0) {
                    console.warn(`Community ${entry.community} in country ${entry.country} not found for entry ${entry.id}`);
                    continue;
                }

                const communityData = rows[0] as Community;

                await setDoc(
                    doc(
                        firestore,
                        'countries',
                        communityData.country,  // Use the country here
                        'communities',
                        communityData.id.toString(),
                        'entries',
                        entry.id.toString()
                    ),
                    entry,
                    { merge: true }
                );
            } catch (error) {
                console.error(`Error processing entry ${entry.id}:`, error);
                continue; // Skip this entry but continue with others
            }
        }

        // Download ALL changes from Firestore directly
        // First, get all country documents from Firestore
        const countriesSnapshot = await getDocs(collection(firestore, 'countries'));

        // For each country, get all communities
        for (const countryDoc of countriesSnapshot.docs) {
            const countryId = countryDoc.id;
            const countryData = countryDoc.data();

            // Get all communities for this country
            const communitiesSnapshot = await getDocs(
                collection(firestore, 'countries', countryId, 'communities')
            );

            // For each community, get entries updated since lastSyncTime
            for (const communityDoc of communitiesSnapshot.docs) {
                const communityId = communityDoc.id;
                const communityData = communityDoc.data();

                let entriesQuery;
                const entriesCollectionPath = collection(
                    firestore,
                    'countries',
                    countryId,
                    'communities',
                    communityId,
                    'entries'
                );

                if (lastSyncTime > 0) {
                    entriesQuery = query(
                        entriesCollectionPath,
                        where('last_updated', '>', lastSyncTime)
                    );
                } else {
                    entriesQuery = entriesCollectionPath;
                }

                const entriesSnapshot = await getDocs(entriesQuery);

                // Ensure the community exists in the local database
                const communityForLocalDB: Community = {
                    id: Number(communityId),
                    country: countryId,
                    name: communityData.name || `Community ${communityId}`,
                    last_updated: communityData.last_updated || Date.now()
                };

                await this.upsertLocalData('communities', communityForLocalDB);

                // Process all entries for this community
                for (const entryDoc of entriesSnapshot.docs) {
                    const entryData = entryDoc.data();

                    const entry: Entry = {
                        id: entryDoc.id,
                        community: communityData.name || `Community ${communityId}`,
                        country: countryId,
                        last_updated: entryData.last_updated || 0,

                        // Required fields with default values
                        arrival_date: entryData.arrival_date || '',
                        arrival_time: entryData.arrival_time || '',
                        time_teachers_arrive: entryData.time_teachers_arrive || '',
                        time_children_leave: entryData.time_children_leave || '',
                        time_classes_start: entryData.time_classes_start || '',
                        time_classes_end: entryData.time_classes_end || '',
                        recess_time: entryData.recess_time || '',
                        num_hours_children: entryData.num_hours_children || '',
                        num_teachers_absent: entryData.num_teachers_absent || '',
                        cleanliness: entryData.cleanliness || '',
                        playground_used: Boolean(entryData.playground_used),
                        sinks_used: Boolean(entryData.sinks_used),
                        classroom_decor: entryData.classroom_decor || '',
                        classrooms_used: Boolean(entryData.classrooms_used),
                        observations: entryData.observations || '',
                        program_type: entryData.program_type || '',
                        num_children: entryData.num_children || '',
                        num_parents: entryData.num_parents || '',
                        program: entryData.program || '',
                    };

                    // Check if required fields are present
                    if (!entry.last_updated || !entry.arrival_date) {
                        console.warn(`Skipping entry ${entryDoc.id} due to missing required fields.`);
                        continue;
                    }

                    await this.upsertLocalData('entries', entry);
                }
            }
        }
    } catch (error) {
        console.error('Error syncing entries:', error);
    }
  }


  // Get last sync timestamp from local storage
  private async getLastSyncTime(): Promise<number> {
    const db = this.getLocalDB();
    
    try {
      const rows: AppMetadataRow[] = await db.getAllAsync(
        'SELECT value FROM app_metadata WHERE key = "lastSyncTime"',
        []
      );
      
      if (rows.length > 0) {
        return Number(rows[0].value);
      }
      return 0; // Default to 0 for first sync
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return 0; // Default to 0 on error
    }
  }
  
  // Update last sync timestamp
  private async updateLastSyncTime(): Promise<void> {
    const timestamp = Date.now();
    const db = this.getLocalDB();
    
    try {
      await db.runAsync(
        'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
        ['lastSyncTime', timestamp.toString()]
      );
    } catch (error) {
      console.error('Error updating last sync time:', error);
      throw error;
    }
  }
  
  // Main sync function
  public async syncData(forceFull: boolean = false): Promise<boolean> {
    // Prevent multiple simultaneous syncs
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return false;
    }
    
    try {
      this.isSyncing = true;
      
      // Initialize database if not already done
      if (!this.db) {
        await this.initDatabase();
      }
      
      // Check internet connection
      const online = await this.isOnline();
      if (!online) {
        console.log('No internet connection available');
        return false;
      }
      
      // Get last sync time (or use 0 for full sync)
      let lastSyncTime = forceFull ? 0 : await this.getLastSyncTime();
      
      // Sync all data types in order (parent entities first)
      await this.syncCountries(lastSyncTime);
      await this.syncCommunities(lastSyncTime);
      await this.syncEntries(lastSyncTime);
      
      // Update last sync time
      await this.updateLastSyncTime();
      
      console.log('Sync completed successfully');
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      Alert.alert('Sync Error', 'There was a problem syncing your data. Please try again later.');
      return false;
    } finally {
      this.isSyncing = false;
    }
  }
}

// Export singleton instance
export const firebaseSync = new FirebaseSync();