import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Admin フッター表示確認', () => {
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

  test('フッターが表示されていること', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    await expect(footer).toContainText('Kakeibo-App');
    await expect(footer).toContainText('Ver. 1.0.0');
    await expect(footer).toContainText('Last update:');

    const currentYear = new Date().getFullYear().toString();
    await expect(footer).toContainText(currentYear);
  });

  test('管理メニューのリンクが存在すること', async ({ page }) => {
    const helpLink = page.getByRole('link', { name: 'ヘルプ' });
    const settingsLink = page.getByRole('link', { name: 'システム設定' });

    await expect(helpLink).toBeVisible();
    await expect(settingsLink).toBeVisible();

    await expect(helpLink).toHaveAttribute('href', '/admin/home');
    await expect(settingsLink).toHaveAttribute('href', '/admin/home');
  });
});