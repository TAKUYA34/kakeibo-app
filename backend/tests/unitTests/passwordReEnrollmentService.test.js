const passwordReEnrollmentServiceTest = require('../../services/passwordReEnrollmentService');
const passwordReEnrollmentRepositoryTest = require('../../repositories/passwordReEnrollmentRepository');
const bcrypt = require('bcrypt');

jest.mock('../../repositories/passwordReEnrollmentRepository');
jest.mock('bcrypt');

/* 正常系テスト */
describe('fetchResetPassword', () => {
  // 引数
  const mockUser = {
    password: 'oldPass',
    resetPasswordToken: 'some-token',
    resetPasswordExpires: Date.now(),
    save: jest.fn()
  };

  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('正常にパスワード登録ができる', async () => {
    // モック設定
    passwordReEnrollmentRepositoryTest.findByResetToken.mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // データ格納
    await passwordReEnrollmentServiceTest.fetchResetPassword('valid-token', 'new-password'); // valid-token:ユーザーを特定するためのtoken

    // 検証
    expect(passwordReEnrollmentRepositoryTest.findByResetToken).toHaveBeenCalledWith('valid-token');
    expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
    // newパスワードを返却
    expect(mockUser.password).toBe('hashedPassword');
    expect(mockUser.resetPasswordToken).toBeNull();
    expect(mockUser.resetPasswordExpires).toBeNull();
    expect(mockUser.save).toHaveBeenCalled();
  });
});

/* 異常系テスト */
describe('fetchResetPassword', () => {

  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('無効なトークンの場合、エラー', async () => {
    // モック生成
    passwordReEnrollmentRepositoryTest.findByResetToken.mockResolvedValue(null);

    await expect(passwordReEnrollmentServiceTest.fetchResetPassword('invalid-token', 'new-password'))
      .rejects.toThrow('無効なトークンです。');
      
    // 検証
    expect(passwordReEnrollmentRepositoryTest.findByResetToken).toHaveBeenCalledWith('invalid-token');
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('DBの接続に失敗した場合、例外スロー', async () => {
    // モックが例外を投げる
    passwordReEnrollmentRepositoryTest.findByResetToken.mockRejectedValue(new Error('DB接続エラー'));
    
    await expect(
      passwordReEnrollmentServiceTest.fetchResetPassword('token', 'password')
    ).rejects.toThrow('DB接続エラー');
  });

  it('新しいパスワードの保存が失敗した場合、例外スロー', async () => {
    const mockUser = {
      password: '',
      resetPasswordToken: 'some-token',
      resetPasswordExpires: new Date(),
      save: jest.fn().mockRejectedValue(new Error('保存失敗'))
    };

    // モック生成
    passwordReEnrollmentRepositoryTest.findByResetToken.mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue('hashedPassword');

    await expect(
      passwordReEnrollmentServiceTest.fetchResetPassword('valid-token', 'new-password')
    ).rejects.toThrow('保存失敗');
  });
});


