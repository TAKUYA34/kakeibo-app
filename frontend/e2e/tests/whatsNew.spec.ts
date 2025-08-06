import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('最新情報セクション（WhatsNew）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
  });

  test('お知らせ画面が表示される', async ({ page }) => {
    // What's New タイトルが表示されること
    await expect(page.getByRole('heading', { name: "What’s New." })).toBeVisible();
  });

  test('ページネーションが機能する', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /次へ/ });
    const prevBtn = page.getByRole('button', { name: /前へ/ });

    // 最初のページでは「前へ」は無効
    await expect(prevBtn).toBeDisabled();

    // 次へをクリックしてページが進む
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.locator('text=2ページ目')).toBeVisible();
    }
  });

  test('ログイン後に最新情報が表示される', async ({ page }) => {
    // ログイン処理
    await page.goto(`${BASE_URL}/home/login`);
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン後にトップページへリダイレクト
    await expect(page).toHaveURL(`${BASE_URL}/home`);

    // お知らせリストの表示を確認
    const list = page.locator('ul[class*=whatsNew_list]');
    const items = page.locator('li[class*=whatsNew_item]');

    await expect(list).toBeVisible();
    await expect(items.first()).toBeVisible();

    // 件数を取得する
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('ログインしていない状態でボタンを押すとログイン画面に遷移', async ({ page }) => {
    await page.getByRole('button', { name: '家計簿のデータリストを見る.' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/home/login`);
  });

  test('ログイン済みなら取引リストに遷移する', async ({ page }) => {
    // ログイン処理（モック or 実アカウント）
    await page.goto(`${BASE_URL}/home/login`);
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン後にトップページへリダイレクト
    await expect(page).toHaveURL(`${BASE_URL}/home`);

    // ボタン押下でリスト画面へ遷移
    await page.getByRole('button', { name: '家計簿のデータリストを見る.' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/home/transactions/list`);
  });
});