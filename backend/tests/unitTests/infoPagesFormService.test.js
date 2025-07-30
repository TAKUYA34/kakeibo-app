// tests/unitTests/sendContactEmailService.test.js
const nodemailer = require('nodemailer');
const infoPagesFormServiceTest = require('../../services/infoPagesFormService');

// メールは送信しない（モックでテスト）
jest.mock('nodemailer');

/* 正常系 */
describe('sendContactEmailService', () => {
  it('問い合わせの内容がメールに届く', async () => {

    // モックデータ
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'abc123' });
    const mockTransport = { sendMail: mockSendMail };
    const mockGetTestMessageUrl = jest.fn().mockReturnValue('http://test.url');

    // モックの設定
    nodemailer.createTestAccount.mockResolvedValue({
      user: 'test_user',
      pass: 'test_pass',
    });
    nodemailer.createTransport.mockReturnValue(mockTransport);
    nodemailer.getTestMessageUrl = mockGetTestMessageUrl;

    // 問い合わせデータ
    const result = await infoPagesFormServiceTest.sendContactEmailService({
      name: '太郎',
      email: 'taro@example.com',
      message: 'こんにちは',
      subject: 'テスト',
    });

    // 検証
    expect(mockSendMail).toHaveBeenCalled();
    expect(result).toBe('http://test.url');
  });
});