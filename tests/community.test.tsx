import * as SQLite from 'expo-sqlite';
import { DatabaseService, Community, createDatabase } from '@/db/base';


// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
 openDatabaseAsync: jest.fn(),
}));


describe('DatabaseService', () => {
 let dbService: DatabaseService;
 let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;


 beforeEach(() => {
   // Create mock database object
   mockDb = {
     execAsync: jest.fn(),
     runAsync: jest.fn(),
     getFirstAsync: jest.fn(),
   } as any;


   // Reset the mock and set default return value
   (SQLite.openDatabaseAsync as jest.Mock).mockReset();
   (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);


   // Create new instance for each test
   dbService = new DatabaseService();
 });


 //testing for the grabbing community by id functionality
 describe('grab community by its id', () => {
   beforeEach(async () => {
     await dbService.initDatabase();
   })
  
   it('should get community by id successfully', async () => {
     const mockCommunity: Community = { id: 1, name: 'Test Community', country: 'Test Country'};
     mockDb.getFirstAsync.mockResolvedValue(mockCommunity);


     const result = await dbService.getCommunityById(1);
     expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      `SELECT * FROM communities WHERE id = ?`, [1]
    );
    expect(result).toEqual(mockCommunity);
  })

  //null case testing
  it('should return null when country is not found', async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);

    const result = await dbService.getCommunityById(999);

    expect(result).toBeNull();
  });
 });
});



