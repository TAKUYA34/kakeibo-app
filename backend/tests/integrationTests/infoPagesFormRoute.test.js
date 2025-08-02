const request = require('supertest');
const appTest = require('../testServer/app.test');

// nodemailer の応答時間の設定
jest.setTimeout(10000);

describe('POST /api/info/contact', () => {
  /* 正常系 */
  it('正しい問い合わせ内容でメール送信に成功する', async () => {
    // supertestを使用してリクエスト
    const response = await request(appTest)
      .post('/api/info/contact')
      .send({
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: '機能について',
        message: 'お問い合わせテスト本文です'
      });

    // 検証
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('お問い合わせ内容を送信しました。');
    expect(response.body.prevUrl).toContain('ethereal.email'); // リンク確認
  });

  /* 異常系 */
  it('ユーザー名が未入力の場合、エラーとなる', async () => {
    // supertestを使用してリクエスト
    const response = await request(appTest)
      .post('/api/info/contact')
      .send({
        name: '', // 名前未入力
        email: 'test@example.com',
        subject: 'バグ報告',
        message: '不具合があります'
      });

    // 検証
    expect(response.statusCode).toBe(400); // バリデーションエラー
    expect(response.body.error).toBe('全ての項目を入力してください。');
  });

  /* 異常系 */
  it('メールアドレスが未入力の場合、エラーとなる', async () => {
    // supertestを使用してリクエスト
    const response = await request(appTest)
      .post('/api/info/contact')
      .send({
        name: 'テストユーザー',
        email: '', // メール未入力
        subject: 'バグ報告',
        message: '不具合があります'
      });

    // 検証
    expect(response.statusCode).toBe(400); // バリデーションエラー
    expect(response.body.error).toBe('全ての項目を入力してください。');
  });

  /* 異常系 */
  it('件名が未入力の場合、エラーとなる', async () => {
    // supertestを使用してリクエスト
    const response = await request(appTest)
      .post('/api/info/contact')
      .send({
        name: 'テストユーザー',
        email: 'example.com',
        subject: '',  // 件名未入力
        message: '不具合があります'
      });

    // 検証
    expect(response.statusCode).toBe(400); // バリデーションエラー
    expect(response.body.error).toBe('全ての項目を入力してください。');
  });

  /* 異常系 */
  it('お問い合わせ内容が未入力の場合、エラーとなる', async () => {
    // supertestを使用してリクエスト
    const response = await request(appTest)
      .post('/api/info/contact')
      .send({
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: 'バグ報告',
        message: '' // お問い合わせ内容未入力
      });

    // 検証
    expect(response.statusCode).toBe(400); // バリデーションエラー
    expect(response.body.error).toBe('全ての項目を入力してください。');
  });

  /* 異常系 */
  it('メール送信失敗時にエラーレスポンスを返す', async () => {
    // require等のキャッシュをクリア
    jest.resetModules();
    const nodemailer = require('nodemailer');

    // 強制的に失敗させるモック
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: () => Promise.reject(new Error('送信エラー')) // 意図的に例外発生させる
    });

    const appWithMock = require('../testServer/app.test'); // 再読み込み

    // supertestを使用してリクエスト
    const response = await request(appWithMock)
      .post('/api/info/contact')
      .send({
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: '障害報告',
        message: 'テストメッセージ'
      });

    // 検証
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('メール送信に失敗しました。');
  });
});