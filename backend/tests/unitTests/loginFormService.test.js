// tests/unitTests/loginFormService.test.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginFormServiceTest = require('../../services/loginFormService');
const loginFormRepositoryTest = require('../../repositories/loginFormRepository');

// 履歴をリセット
afterEach(() => jest.clearAllMocks());


// モックをクリア
jest.mock('../../repositories/loginFormRepository');

/* login 正常系 */
describe('login', () => {
  it('正常系: ログイン成功し、トークンが返る', async () => {  
    // 引数
    const dummyUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
    };

    // モック
    loginFormRepositoryTest.findByEmail.mockResolvedValue(dummyUser);
    loginFormRepositoryTest.updateLoginStatus.mockResolvedValue();
    
    // 検証
    const token = await loginFormServiceTest.login('test@example.com', 'password123');
    const tokenString = token.token;
    expect(typeof tokenString).toBe('string');

    // jwtToken のモック
    const jwtToken = process.env.JWT_SECRET;
    console.log('JWT_SECRET in test:', jwtToken);
    const decoded = jwt.verify(tokenString, jwtToken);
    expect(decoded.email).toBe('test@example.com');
    expect(decoded.role).toBe('user');
  });
});

/* login 異常系 */
describe('login', () => {
  it('異常系: ユーザーが見つからない', async () => {
    // モック
    loginFormRepositoryTest.findByEmail.mockResolvedValue(null);

    // 検証
    await expect(
      loginFormServiceTest.login('notfound@example.com', 'password')
    ).rejects.toThrow('ユーザーが見つかりません。');
  });

  it('異常系: パスワードが違う', async () => {
    // 引数
    const dummyUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: await bcrypt.hash('correctpass', 10),
    };

    // モック
    loginFormRepositoryTest.findByEmail.mockResolvedValue(dummyUser);

    // 検証
    await expect(
      loginFormServiceTest.login('test@example.com', 'wrongpass')
    ).rejects.toThrow('パスワードが間違っています。');
  });

  it('異常系: DBエラー', async () => {

    // モック
    loginFormRepositoryTest.findByEmail.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(
      loginFormServiceTest.login('test@example.com', 'password')
    ).rejects.toThrow('DB接続失敗');
  });
});

/* logout 正常系 */
describe('logout', () => {
  it('正常系: ステータスをfalseに変更', async () => {
    // モック
    loginFormRepositoryTest.updateLoginStatus.mockResolvedValue({ acknowledged: true });

    // ログアウト成功
    await expect(
      loginFormServiceTest.logout('user123')
    ).resolves.toBeUndefined();
    
    // 検証
    expect(loginFormRepositoryTest.updateLoginStatus).toHaveBeenCalledWith('user123', false);
  });
});

/* logout 異常系 */
describe('logout', () => {
  it('異常系: DBエラー', async () => {
    // モック
    loginFormRepositoryTest.updateLoginStatus.mockRejectedValue(new Error('DB失敗'));

    // 検証
    await expect(
      loginFormServiceTest.logout('user123')
    ).rejects.toThrow('DB失敗');
  });
});

/* getMyInfo 正常系 */
describe('getMyInfo', () => {
  it('正常系: ユーザー情報を返す', async () => {
    // 引数
    const dummyUser = { _id: 'user123', email: 'test@example.com' };

    // モック
    loginFormRepositoryTest.findById.mockResolvedValue(dummyUser);

    // 検証
    const user = await loginFormServiceTest.getMyInfo('user123');
    expect(user).toEqual(dummyUser);
  });
});

/* getMyInfo 異常系 */
describe('getMyInfo', () => {
  it('異常系: データが見つからない', async () => {
    // モック
    loginFormRepositoryTest.findById.mockResolvedValue(null);

    // 検証
    const user = await loginFormServiceTest.getMyInfo('unknown');
    expect(user).toBeNull();
  });

  it('異常系: DBエラー', async () => {
    // モック
    loginFormRepositoryTest.findById.mockRejectedValue(new Error('DBエラー'));

    // 検証
    await expect(
      loginFormServiceTest.getMyInfo('user123')
    ).rejects.toThrow('DBエラー');
  });
});


/* getAllUsers 正常系 */
describe('getAllUsers', () => {
  it('正常系: 全ユーザー取得', async () => {
    // 引数
    const dummyUsers = [{ _id: 'u1' }, { _id: 'u2' }];

    // モック
    loginFormRepositoryTest.findAllExcludingPassword.mockResolvedValue(dummyUsers);

    // 検証
    const users = await loginFormServiceTest.getAllUsers();
    expect(users).toEqual(dummyUsers);
  });
});

/* getAllUsers 異常系 */
describe('getAllUsers', () => {
  it('異常系: DBエラー', async () => {

    // モック
    loginFormRepositoryTest.findAllExcludingPassword.mockRejectedValue(new Error('DB失敗'));

    // 検証
    await expect(
      loginFormServiceTest.getAllUsers()
    ).rejects.toThrow('DB失敗');
  });
});



