import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('CurrentMoneyGraph（収支・支出グラフ） E2Eテスト', () => {

  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto(`${BASE_URL}/home/login`);
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // メイン画面へ
    await expect(page).toHaveURL(`${BASE_URL}/home`);
  });

  test('グラフ出力画面が表示される', async ({ page }) => {
    // Current MoneyGraph タイトルが表示されること
    await expect(page.getByRole('heading', { name: "Current MoneyGraph." })).toBeVisible();
  });

  test('グラフ2つが正しく表示される', async ({ page }) => {
    const barGraph = page.locator('svg').nth(0); // 1つ目（棒グラフ）
    const pieGraph = page.locator('svg').nth(1); // 2つ目（円グラフ）

    await expect(barGraph).toBeVisible();
    await expect(pieGraph).toBeVisible();
  });

test('棒グラフに収入と支出が表示されている', async ({ page }) => {
    // Recharts の凡例部分に含まれる span を限定
    const legendIncome = page.locator('.recharts-legend-item-text', { hasText: '収入' });
    const legendExpense = page.locator('.recharts-legend-item-text', { hasText: '支出' });

    await expect(legendIncome).toBeVisible();
    await expect(legendExpense).toBeVisible();
  });

  test('円グラフにカテゴリラベルが表示される', async ({ page }) => {
    // 光熱費のラベルまたは円グラフのセグメント上に表示される「電気 (xx%)」などを取得
    const legendUtility = page.locator('.recharts-legend-item-text', { hasText: 'utility' }); // DBは'utility'で登録されている
    const labelElectricity = page.locator('text=/電気.*\\%/');

    await expect(legendUtility.or(labelElectricity)).toBeVisible();
  });
});