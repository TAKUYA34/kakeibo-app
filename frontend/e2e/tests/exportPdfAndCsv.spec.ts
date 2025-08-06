import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('帳票出力画面 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン画面のURLにアクセス
    await page.goto(`${BASE_URL}/home/login`);

    // メールとパスワードを入力
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // 遷移確認
    await expect(page).toHaveURL(`${BASE_URL}/home`);

    // 帳票出力画面へ
    await page.goto(`${BASE_URL}/home/export`);
  });

  test('初期表示が正しくされる', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Data Export' })).toBeVisible();
    await expect(page.locator('select')).toHaveCount(3); // 年・月・形式
  });

  test('年と月と形式を選んでダウンロードできる', async ({ page }) => {
    await page.waitForSelector('select'); // selectが読み込まれるまで待つ

    await page.selectOption('select[name=yearDate]', '2025'); // 年
    await page.selectOption('select[name=monthDate]', '7');    // 月
    await page.selectOption('select[name=format]', 'pdf');  // 形式

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'ダウンロード' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('summary_2025_07.pdf');
  });

  test('年だけ選択、月なし → 年単位で出力される', async ({ page }) => {
    await page.selectOption('select[name=yearDate]', '2025');
    await page.selectOption('select[name=format]', 'csv');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'ダウンロード' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('summary_2025.csv');
  });

  test('年未選択でダウンロードしたらtoastが表示される', async ({ page }) => {
    // 年も形式も未選択のままクリック
    await page.getByRole('button', { name: 'ダウンロード' }).click();

    await expect(page.getByText('年もしくは形式の入力が必須です')).toBeVisible();
  });

  test('トークンがない場合、ログインにリダイレクトされる', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.reload();
    await expect(page).toHaveURL(`${BASE_URL}/home/login`);
  });
});