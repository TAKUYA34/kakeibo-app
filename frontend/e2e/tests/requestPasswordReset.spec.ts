import { test, expect } from '@playwright/test';

test.describe('パスワードリセットリクエスト画面 E2Eテスト', () => {

    test.beforeEach(async ({ page }) => {
      // 新規登録画面へ
      await page.goto('http://localhost:3000/home/login');
    });


  test('正しいメールアドレスを入力してリクエスト送信したら成功メッセージが表示される', async ({ page }) => {
    await page.goto('http://localhost:3000/home/login/password/reset');

    // メールアドレス入力
    await page.fill('input[type="email"]', 'test22@co.jp');

    // 送信ボタンクリック
    await page.getByRole('button', { name: '送信' }).click();

    // 成功メッセージ確認
    await expect(page.locator('text=パスワードをリセットするリクエストメールを送信しました')).toBeVisible();
  });

  test('メールアドレスが空の状態で送信したらHTML5バリデーションが機能する', async ({ page }) => {
    await page.goto('http://localhost:3000/home/login/password/reset');

    // 空のまま送信
    await page.getByRole('button', { name: '送信' }).click();

    // HTML5バリデーションによって送信されないため、エラーメッセージ表示もなし
    await expect(page.locator('.successMessage')).toHaveCount(0);
    await expect(page.locator('.errorMessage')).toHaveCount(0);
  });

  test('存在しないメールアドレスを入力して送信したらエラーメッセージが表示される', async ({ page }) => {
    await page.goto('http://localhost:3000/home/login/password/reset');

    // 存在しないメールアドレス
    await page.fill('input[type="email"]', 'notfound@example.com');

    // 送信ボタン押下
    await page.getByRole('button', { name: '送信' }).click();

    // エラーメッセージ表示確認
    await expect(page.locator('text=エラーが発生しました。メールアドレスをご確認ください。')).toBeVisible();
  });
});