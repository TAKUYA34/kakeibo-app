// tests/unitTests/adminLoginFormService.test.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminLoginFormRepositoryTest = require('../../repositories/adminLoginFormRepository');
const adminLoginFormServiceTest = require('../../services/adminLoginFormService');

// モック化
jest.mock('../../repositories/adminLoginFormRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// 引数
const mockAdmin = {
  _id: 'admin123',
  user_id: 'admin001',
  user_name: '管理者',
  email: 'admin@example.com',
  password: 'hashedPassword',
  role: 'admin'
};

// 検証後、履歴をリセット
afterEach(() => {
  jest.clearAllMocks();
});

/* loginAdminUser 正常系 */
describe('loginAdminUser', () => {
  it('正しいメールとパスワードでトークンとユーザー情報を返す', async () => {
    // token
    const mockToken = 'mocked.jwt.token';

    // モック
    adminLoginFormRepositoryTest.findAdminByEmail.mockResolvedValue(mockAdmin);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    // モックデータを格納
    const result = await adminLoginFormServiceTest.loginAdminUser('admin@example.com', 'password123');

    // 検証
    expect(result.token).toBe(mockToken);
    expect(result.user).toEqual({
      user_id: 'admin001',
      user_name: '管理者',
      email: 'admin@example.com',
      role: 'admin'
    });
  });
});

/* loginAdminUser 異常系 */
describe('loginAdminUser', () => {
  it('存在しないユーザーの場合、エラーを投げる', async () => {

    // モック
    adminLoginFormRepositoryTest.findAdminByEmail.mockResolvedValue(null);

    // 検証
    await expect(adminLoginFormServiceTest.loginAdminUser('wrong@example.com', 'password123'))
      .rejects.toThrow('管理者情報が見つかりません');
  });

  it('admin以外のroleの場合、エラーを投げる', async () => {
    // モック
    adminLoginFormRepositoryTest.findAdminByEmail.mockResolvedValue({ ...mockAdmin, role: 'user' });

    // 検証
    await expect(adminLoginFormServiceTest.loginAdminUser('admin@example.com', 'password123'))
      .rejects.toThrow('管理者情報が見つかりません');
  });

  it('パスワードが間違っている場合、エラーを投げる', async () => {
    // モック
    adminLoginFormRepositoryTest.findAdminByEmail.mockResolvedValue(mockAdmin);
    bcrypt.compare.mockResolvedValue(false);

    // 検証
    await expect(adminLoginFormServiceTest.loginAdminUser('admin@example.com', 'wrongpass'))
      .rejects.toThrow('パスワードが違います');
  });

  it('DB接続エラー', async () => {
    // モック
    adminLoginFormRepositoryTest.findAdminByEmail.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminLoginFormServiceTest.loginAdminUser('admin@example.com', 'password123'))
      .rejects.toThrow('DB接続失敗');
  });
});

/* fetchAdminProfile 正常系 */
describe('fetchAdminProfile', () => {
  it('adminユーザーであればプロフィールを返す', async () => {
    // モック
    adminLoginFormRepositoryTest.findAdminById.mockResolvedValue(mockAdmin);

    // モックデータ格納
    const result = await adminLoginFormServiceTest.fetchAdminProfile({ _id: 'admin123', role: 'admin' });

    // 検証
    expect(result).toEqual(mockAdmin);
  });
});

/* fetchAdminProfile 異常系 */
describe('fetchAdminProfile', () => {
  it('admin以外のroleならnullを返す', async () => {
    // 一般ユーザー
    const result = await adminLoginFormServiceTest.fetchAdminProfile({ _id: 'admin123', role: 'user' });

    // 検証
    expect(result).toBeNull();
  });

  it('userPayloadがnullならnullを返す', async () => {
    // userデータがnull
    const result = await adminLoginFormServiceTest.fetchAdminProfile(null);

    // 検証
    expect(result).toBeNull();
  });

  it('DB接続エラー', async () => {
    // モック
    adminLoginFormRepositoryTest.findAdminById.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminLoginFormServiceTest.fetchAdminProfile({ _id: 'admin123', role: 'admin' }))
      .rejects.toThrow('DB接続失敗');
  });
});

