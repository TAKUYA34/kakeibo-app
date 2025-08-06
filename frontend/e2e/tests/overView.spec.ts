import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OverView（概要）画面 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
  });
  
  test('概要画面が表示される', async ({ page }) => {
    // Over View タイトルが表示されること
    await expect(page.getByRole('heading', { name: "Over View." })).toBeVisible();
  });

  test('未ログイン時、「家計簿を登録する」ボタンをクリックしたらログインページへリダイレクト', async ({ page }) => {
    // 家計簿登録画面への遷移ボタンを押下
    await page.getByRole('button', { name: '家計簿を登録する.' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/home/login`);
  });

  test('ログイン済みの場合、「家計簿を登録する」ボタンをクリックしたら登録ページへ遷移する', async ({ page }) => {
    // ログイン処理
    await page.goto(`${BASE_URL}/home/login`);
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン後にトップページへリダイレクト
    await expect(page).toHaveURL(`${BASE_URL}/home`);

    // 家計簿登録画面への遷移ボタンを押下
    await page.getByRole('button', { name: '家計簿を登録する.' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/home/transactions/add`);
  });

  test('OverView画面には3つの説明アイテムが表示される', async ({ page }) => {
    const items = page.locator('div[class*=overview_item]');
    await expect(items).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      const image = items.nth(i).locator('img');
      const text = items.nth(i).locator('p');
      await expect(image).toBeVisible();
      await expect(text).toBeVisible();
    }
  });
});