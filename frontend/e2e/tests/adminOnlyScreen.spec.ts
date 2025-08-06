import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('管理者専用ダッシュボード（AdminOnlyScreen）', () => {
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

  test('ログインしていない場合はログインページへリダイレクトされる', async ({ page }) => {
    // ログアウト状態でページ読み込み
    await page.evaluate(() => localStorage.removeItem('admin_token'));
    await page.reload();
    await expect(page).toHaveURL(`${BASE_URL}/admin/login`);
  });

  test('ユーザー統計カードが正しく表示される（ダミーデータ）', async ({ page }) => {
    await page.waitForSelector('h1', { timeout: 3000 });
    await expect(page.getByRole('heading', { name: 'ユーザー全体の統計' })).toBeVisible();

    // 各統計の見出しが存在
    await expect(page.getByRole('heading', { name: '総ユーザー数' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '今月の取引数' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '今月の総支出' })).toBeVisible();

    // 数値も表示されているか確認（ダミーでも）
    const cards = page.locator('div[class*="statCard"] p');
    await expect(cards.nth(0)).not.toBeEmpty();
    await expect(cards.nth(1)).not.toBeEmpty();
    await expect(cards.nth(2)).not.toBeEmpty();
  });

  test('月別収支グラフが表示されている', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '月別収支の推移' })).toBeVisible();

    // RechartsのカスタムSVGが存在するか（棒グラフと折れ線）
    const composedChart = page.locator('div > svg').first();
    await expect(composedChart).toBeVisible();
    // 凡例に "支出" が表示されているか
    await expect(page.locator('.recharts-legend-item-text', { hasText: '支出' })).toBeVisible();
    await expect(page.locator('.recharts-legend-item-text', { hasText: '収入' })).toBeVisible();
    await expect(page.locator('.recharts-legend-item-text', { hasText: '収支差額' })).toBeVisible();
  });

  test('カテゴリ別支出円グラフが表示されている', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'カテゴリ別支出割合' })).toBeVisible();

    const pieChart = page.locator('div > svg').first();
    await expect(pieChart).toBeVisible();
    await expect(page.locator('.recharts-legend-item-text', { hasText: '食費' })).toBeVisible();
    await expect(page.locator('.recharts-legend-item-text', { hasText: '交通費' })).toBeVisible();
  });
});