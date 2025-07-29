const crypto = require('crypto'); // token生成
const requestPasswordResetServiceTest = require('../../services/requestPasswordResetService');
const requestPasswordResetRepositoryTest = require('../../repositories/requestPasswordResetRepository');
const sendResetEmailTest = require('../../utils/mailer');

// モックの設定
jest.mock('../../repositories/requestPasswordResetRepository');
jest.mock('../../utils/mailer');

/* 正常系テスト */
describe('handlePasswordResetRequest', () => {
  // tokenを固定にする
  beforeAll(() => {
    jest.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.from('mocktoken1234567890mocktoken1234567890'));
  });
  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 引数
  const email = 'test@example.com';
  const mockUser = { _id: 'dummyUser45', email };

  it('正常にリセットメールを送信する', async () => {
    // リセットメールリクエスト処理
    requestPasswordResetRepositoryTest.findByEmail.mockResolvedValue(mockUser);
    requestPasswordResetRepositoryTest.updateResetToken.mockResolvedValue();
    sendResetEmailTest.sendTestResetEmail.mockResolvedValue();

    // 指定のメールアドレス宛に送信
    await requestPasswordResetServiceTest.handlePasswordResetRequest(email);

    // 検証
    expect(requestPasswordResetRepositoryTest.findByEmail).toHaveBeenCalledWith(email);
    expect(requestPasswordResetRepositoryTest.updateResetToken).toHaveBeenCalledWith(
      mockUser._id,
      expect.any(String),
      expect.any(Number)
    )
    expect(sendResetEmailTest.sendTestResetEmail).toHaveBeenCalledWith(
      mockUser.email,
      expect.stringContaining('http://localhost:3000/home/login/password/reset/confirm?token=')
    );
  });
})

/* 異常系テスト */
describe('handlePasswordResetRequest', () => {
  // tokenを固定にする
  beforeAll(() => {
    jest.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.from('mocktoken1234567890mocktoken1234567890'));
  });
  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 引数
  const email = 'test@example.com';
  const mockUser = { _id: 'dummyUser45', email };

  it('ユーザーが見つからない場合はエラー', async () => {
    // メールアドレスをnullに
    requestPasswordResetRepositoryTest.findByEmail.mockResolvedValue(null);
    // 検証
    await expect(requestPasswordResetServiceTest.handlePasswordResetRequest(email)).rejects.toThrow('ユーザーが見つかりません');
  });

  it('トークン保存に失敗した場合、例外スロー', async () => {
    requestPasswordResetRepositoryTest.findByEmail.mockResolvedValue(mockUser);
    requestPasswordResetRepositoryTest.updateResetToken.mockRejectedValue(new Error('トークン発行失敗'));

    await expect(requestPasswordResetServiceTest.handlePasswordResetRequest(email)).rejects.toThrow('トークン発行失敗');
  });

  it('メールの送信に失敗した場合、例外スロー', async () => {
    requestPasswordResetRepositoryTest.findByEmail.mockResolvedValue(mockUser);
    requestPasswordResetRepositoryTest.updateResetToken.mockResolvedValue();
    sendResetEmailTest.sendTestResetEmail.mockRejectedValue(new Error('SMTPエラー'));

    await expect(requestPasswordResetServiceTest.handlePasswordResetRequest(email)).rejects.toThrow('SMTPエラー');
  });
});