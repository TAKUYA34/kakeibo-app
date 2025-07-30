// tests/signUpFormService.test.js
const signUpFormServiceTest = require('../../services/signUpFormService');
const signUpFormRepositoryTest = require('../../repositories/signUpFormRepository');
const bcrypt = require('bcrypt');

jest.mock('../../repositories/signUpFormRepository');
jest.mock('bcrypt');

/* 正常系テスト */
describe('register', () => {
  // 引数
  const inputUser = {
    user_name: 'Taro',
    email: 'taro@example.com',
    password: 'password123'
  };

  // 検証後に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('新規登録できる', async () => {

    // モック
    signUpFormRepositoryTest.findAll.mockResolvedValue([]);
    bcrypt.compare.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    signUpFormRepositoryTest.createUser.mockResolvedValue();

    // モック登録完了
    await expect(signUpFormServiceTest.register(inputUser)).resolves.toBeUndefined();

    // 検証
    expect(signUpFormRepositoryTest.findAll).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(inputUser.password, 10);
    expect(signUpFormRepositoryTest.createUser).toHaveBeenCalledWith({
      user_name: inputUser.user_name,
      email: inputUser.email,
      password: 'hashedPassword123'
    });
  });

  it('正常系: 取得ユーザーが空配列でも登録可能', async () => {
    // モック
    signUpFormRepositoryTest.findAll.mockResolvedValue([]);
    bcrypt.compare.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    signUpFormRepositoryTest.createUser.mockResolvedValue();

    // 検証
    await expect(signUpFormServiceTest.register(inputUser)).resolves.toBeUndefined();
  });

});

/* 異常系テスト */
describe('register', () => {
  // 引数
  const inputUser = {
    user_name: 'Taro',
    email: 'taro@example.com',
    password: 'password123'
  };

  // 検証後に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('異常系: パスワードが既存ユーザーと一致したら例外スロー', async () => {

    // モック
    signUpFormRepositoryTest.findAll.mockResolvedValue([{ password: 'existingHashed' }]);
    bcrypt.compare.mockResolvedValue(true);

    // 検証
    await expect(signUpFormServiceTest.register(inputUser)).rejects.toThrow('このパスワードは既に使われています。');
    expect(signUpFormRepositoryTest.createUser).not.toHaveBeenCalled();
  });

  it('異常系: ユーザー作成に失敗したら例外スロー', async () => {

    // モック
    signUpFormRepositoryTest.findAll.mockResolvedValue([]);
    bcrypt.compare.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    signUpFormRepositoryTest.createUser.mockRejectedValue(new Error('DBエラー'));

    // 検証
    await expect(signUpFormServiceTest.register(inputUser)).rejects.toThrow('DBエラー');
  });
});
