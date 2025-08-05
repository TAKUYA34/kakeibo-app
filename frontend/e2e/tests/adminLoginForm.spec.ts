import { test, expect } from '@playwright/test';

test.describe('管理者ログイン画面 E2Eテスト', () => {

  test('正しい資格情報でログインできる', async ({ page }) => {
    const adminEmail = 'hakenad907@gmail.com';
    // 末尾に!を付けることで常にstring型で受け取れる
    const adminPassword = process.env.ADMIN_PASSWORD!;

    // 管理者ログインページへ
    await page.goto('http://localhost:3000/admin/login');

    // ログイン情報入力
    await page.getByLabel('メールアドレス').fill(adminEmail);
    await page.getByLabel('パスワード').fill(adminPassword);
    // console.log('adminEmail', adminEmail);
    // console.log('adminPassword', adminPassword);

    // 送信（リダイレクト待機）
    await Promise.all([
      page.waitForURL('**/admin/home', { waitUntil: 'load' }),
      page.getByRole('button', { name: 'ログイン' }).click(),
    ]);

    // 遷移先確認
    await expect(page).toHaveURL('http://localhost:3000/admin/home');
  });

  test('誤った資格情報でログインに失敗する', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');

    // 入力
    await page.getByLabel('メールアドレス').fill('wrong@example.com');
    await page.getByLabel('パスワード').fill('wrongpassword');

    // alert を検出
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('ログイン失敗');
      await dialog.dismiss(); // OKボタンを押す
    });

    // ログインボタンクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ページ遷移しないことを確認（任意）
    await expect(page).toHaveURL('http://localhost:3000/admin/login');
  });
});