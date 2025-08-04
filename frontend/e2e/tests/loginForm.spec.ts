import { test, expect } from '@playwright/test'; // テスト, 検証

/* ログイン検証 */
test.describe('ログイン画面 E2Eテスト', () => {
  
  test('ログイン成功時に /home に遷移する', async ({ page }) => {
    // ログイン画面のURLにアクセス
    await page.goto('http://localhost:3000/home/login');

    // メールとパスワードを入力
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // 遷移確認
    await expect(page).toHaveURL('http://localhost:3000/home');
  });

  test('パスワード不足でエラーメッセージが出る', async ({ page }) => {
    await page.goto('http://localhost:3000/home/login');

    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('123'); // パスワードを短くする

    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page.locator('text=パスワードは6文字以上で入力してください')).toBeVisible();
  });
});