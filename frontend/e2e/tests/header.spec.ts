import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Header コンポーネント E2Eテスト', () => {

  test.beforeEach(async ({ page }) => {
    // メイン画面へ
    await page.goto(`${BASE_URL}/home`);
  });

  test('アプリ名リンクが表示されている', async ({ page }) => {
    const appTitle = page.locator('header >> text=Kakeibo-app');
    await expect(appTitle).toBeVisible();
    await expect(appTitle).toHaveAttribute('href', '/home');
  });

  test('非ログイン時に Sign up / Log in リンクが表示される', async ({ page }) => {
    await expect(page.locator('text=Sign up')).toBeVisible();
    await expect(page.locator('text=Log in')).toBeVisible();
  });

  test('ログイン時に user_name / Log out リンクが表示される', async ({ page }) => {
    // ログイン処理
    await page.goto(`${BASE_URL}/home/login`);
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン後にトップページへリダイレクト
    await expect(page).toHaveURL(`${BASE_URL}/home`);

    await expect(page.locator('text=テスト22号')).toBeVisible();
    await expect(page.locator('text=Log out')).toBeVisible();
  });

  test('メニューのホバー表示とリンクが正しく機能する', async ({ page }) => {
    const menuTrigger = page.locator('text=Menus');
    await expect(menuTrigger).toBeVisible();

    // ホバーしてメニュー表示
    await menuTrigger.hover();
    const exportLink = page.locator('text=Export');
    const profileLink = page.locator('text=profile');

    await expect(exportLink).toBeVisible();
    await expect(profileLink).toBeVisible();
  });
});