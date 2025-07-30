// tests/unitTests/adminUsersManagementDataService.test.js
const adminUsersManagementDataServiceTest = require('../../services/adminUsersManagementDataService');
const adminUsersManagementDataRepositoryTest = require('../../repositories/adminUsersManagementDataRepository');

// モック化
jest.mock('../../repositories/adminUsersManagementDataRepository');

// 検証後、履歴をリセット
afterEach(() => {
  jest.clearAllMocks();
});

/* fetchUsersExcludingAdmins 正常系 */
describe('fetchUsersExcludingAdmins', () => {
  it('管理者を除く全ユーザーを取得する', async () => {
    // 引数
    const dummyUsers = [
      { _id: '1', username: 'user1' },
      { _id: '2', username: 'user2' }
    ];

    // モック
    adminUsersManagementDataRepositoryTest.findUsersWithoutAdmins.mockResolvedValue(dummyUsers);

    // 検証
    const result = await adminUsersManagementDataServiceTest.fetchUsersExcludingAdmins();
    expect(adminUsersManagementDataRepositoryTest.findUsersWithoutAdmins).toHaveBeenCalled();
    expect(result).toEqual(dummyUsers);
  });
});

/* fetchUsersExcludingAdmins 異常系 */
describe('fetchUsersExcludingAdmins', () => {
  it('DB接続エラー', async () => {
    // モック
    adminUsersManagementDataRepositoryTest.findUsersWithoutAdmins.mockRejectedValue(new Error('DB取得失敗'));

    // 検証
    await expect(adminUsersManagementDataServiceTest.fetchUsersExcludingAdmins()).rejects.toThrow('DB取得失敗');
  });
});

/* fetchUsersByName 正常系 */
describe('fetchUsersByName', () => {
  it('指定した名前のユーザーを取得する', async () => {
    // 引数
    const dummyUser = [{ _id: '3', username: 'John' }];

    // モック
    adminUsersManagementDataRepositoryTest.findUserByName.mockResolvedValue(dummyUser);

    // 検証
    const result = await adminUsersManagementDataServiceTest.fetchUsersByName('John');
    expect(adminUsersManagementDataRepositoryTest.findUserByName).toHaveBeenCalledWith('John');
    expect(result).toEqual(dummyUser);
  });
});

/* fetchUsersByName 異常系 */
describe('fetchUsersByName', () => {
  it('検索失敗時、エラーを投げる', async () => {
    // モック
    adminUsersManagementDataRepositoryTest.findUserByName.mockRejectedValue(new Error('検索失敗'));

    // 検証
    await expect(adminUsersManagementDataServiceTest.fetchUsersByName('John')).rejects.toThrow('検索失敗');
  });
});

/* updateUserById 正常系 */
describe('updateUserById', () => {
  it('ユーザー情報を更新する', async () => {
    // 引数
    const userId = '123abc';
    const updatedData = { username: 'newName' };
    const updatedUser = { _id: userId, username: 'newName' };

    // モック
    adminUsersManagementDataRepositoryTest.getUpdateUserById.mockResolvedValue(updatedUser);

    // 検証
    const result = await adminUsersManagementDataServiceTest.updateUserById(userId, updatedData);
    expect(adminUsersManagementDataRepositoryTest.getUpdateUserById).toHaveBeenCalledWith(userId, updatedData);
    expect(result).toEqual(updatedUser);
  });
});

/* updateUserById 異常系 */
describe('updateUserById', () => {
  it('更新失敗時にエラーを投げる', async () => {
    // モック
    adminUsersManagementDataRepositoryTest.getUpdateUserById.mockRejectedValue(new Error('更新失敗'));

    // 検証
    await expect(adminUsersManagementDataServiceTest.updateUserById('123abc', { username: 'x' })).rejects.toThrow('更新失敗');
  });
});

/* deleteUserById 正常系 */
describe('deleteUserById', () => {
  it('ユーザー情報を削除する', async () => {
    // 引数
    const userId = 'delete123';
    const deletedUser = { acknowledged: true, deletedCount: 1 };

    // モック
    adminUsersManagementDataRepositoryTest.getDeleteUserById.mockResolvedValue(deletedUser);

    // 検証
    const result = await adminUsersManagementDataServiceTest.deleteUserById(userId);
    expect(adminUsersManagementDataRepositoryTest.getDeleteUserById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(deletedUser);
  });
});

/* deleteUserById 異常系 */
describe('deleteUserById', () => {
  it('削除失敗時にエラーを投げる', async () => {
    // 引数
    adminUsersManagementDataRepositoryTest.getDeleteUserById.mockRejectedValue(new Error('削除失敗'));

    // 検証
    await expect(adminUsersManagementDataServiceTest.deleteUserById('delete123')).rejects.toThrow('削除失敗');
  });
});

