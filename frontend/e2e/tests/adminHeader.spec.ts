import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Admin ヘッダー表示と操作', () => {
  test.beforeEach(async ({ page }) => {
    const adminEmail = 'zhuoshanben281@gmail.com';
    // 末尾に!を付けることで常にstring型で受け取れる
    const adminPassword = process.env.ADMIN_PASSWORD!;

    // 管理者ログインページへ
    await page.goto(`${BASE_URL}/admin/login`);

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
    await expect(page).toHaveURL(`${BASE_URL}/admin/home`);
  });

  test('ヘッダーのロゴとタイトルが表示されている', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('Kakeibo-App');
  });

  test('ログイン時にナビゲーションリンクが表示される', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'ユーザー管理' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ユーザー取引管理' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'お知らせ管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
  });

  test('リンクをクリックして正しいページに遷移できる', async ({ page }) => {
    await page.getByRole('link', { name: 'ユーザー管理' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/admin/home/users`);

    await page.goto('/admin/home');
    await page.getByRole('link', { name: 'ユーザー取引管理' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/admin/home/dashboard`);

    await page.goto('/admin/home');
    await page.getByRole('link', { name: 'お知らせ管理' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/admin/home/report`);
  });

  test('ログアウトボタンを押した時に確認ダイアログが出てキャンセルできる', async ({ page }) => {
    // ダイアログでキャンセルを選択
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('ログアウトしますか？');
      await dialog.dismiss(); // Cancel
    });

    await page.getByRole('button', { name: 'ログアウト' }).click();

    // stay on the page
    await expect(page).toHaveURL(`${BASE_URL}/admin/home`);
  });

  test('ログアウトボタンを押した時に確認後ログアウト処理される', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('ログアウトしますか？');
      await dialog.accept(); // OK
    });

    await page.getByRole('button', { name: 'ログアウト' }).click();

    // ログアウト後は login に遷移するなど（適宜変更）
    await expect(page).toHaveURL(`${BASE_URL}/admin/login`);
  });
});