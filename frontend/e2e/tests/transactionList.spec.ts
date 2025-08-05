import { test, expect } from '@playwright/test';

test.describe('家計簿一覧画面 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン画面のURLにアクセス
    await page.goto('http://localhost:3000/home/login');

    // メールとパスワードを入力
    await page.getByLabel('メールアドレス').fill('test22@co.jp');
    await page.getByLabel('パスワード').fill('2testtest');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // 遷移確認
    await expect(page).toHaveURL('http://localhost:3000/home');
    
    // 家計簿登録ボタンをクリック
    await page.getByRole('button', { name: '家計簿のデータリストを見る.' }).click();

    // 家計簿登録画面へ
    await page.goto('http://localhost:3000/home/transactions/list');
  });

test('年・月・検索フォームが正しく表示される', async ({ page }) => {
    await expect(page.getByLabel('年：')).toBeVisible();
    await expect(page.getByLabel('月：')).toBeVisible();
    await expect(page.getByLabel('検索：')).toBeVisible();
  });

  test('年・月を選択してテーブルが更新される', async ({ page }) => {
    await page.waitForSelector('select'); // selectが読み込まれるまで待つ

    await page.selectOption('select[name=yearDate]', '2025');
    await page.selectOption('select[name=monthDate]', '7');

    // テーブルが更新されるのを待つ
    await page.waitForSelector('table > tbody > tr');

    // 行が1つ以上表示されるか確認
    const rows = await page.$$('table > tbody > tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('検索で絞り込みができる', async ({ page }) => {
    await page.waitForSelector('input#search');
    await page.fill('input#search', '光熱費');

    // 検索結果に「光熱費」が含まれる行だけが表示される想定
    const rows = await page.$$('table > tbody > tr');
    const textContents = await Promise.all(rows.map(row => row.textContent()));
    
    // 「光熱費」を含む行が1つ以上あること
    expect(textContents.some(text => text?.includes('光熱費'))).toBeTruthy();
  });

  test('合計行が表示されている', async ({ page }) => {
    await page.selectOption('select[name=yearDate]', '2025');
    await page.selectOption('select[name=monthDate]', '7');

    await page.waitForSelector('table > tbody > tr');

    // 支出合計が含まれる行が存在するか
    const totalRow = await page.locator('table > tbody > tr').filter({
      hasText: '支出 合計'
    });

    await expect(totalRow.first()).toBeVisible();
  });
});