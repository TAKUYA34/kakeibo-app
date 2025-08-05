import { test, expect } from '@playwright/test';

test.describe('家計簿登録画面 E2Eテスト', () => {
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
    await page.getByRole('button', { name: '家計簿を登録する.' }).click();

    // 家計簿登録画面へ
    await page.goto('http://localhost:3000/home/transactions/add');
  });

  test('フォーム入力して取引を追加できる', async ({ page }) => {
    // 大項目選択
    await page.selectOption('select[name=majorSelect]', 'expense');
    // 日付選択
    await page.fill('input[name=date]', '2025-08-05');
    // 中項目選択
    await page.selectOption('select[name=middleSelect]', 'food');
    // 小項目選択
    await page.selectOption('select[name=minorSelect]', '食料品');
    // 金額入力
    await page.fill('input[name=amount]', '5,000');
    // メモ入力
    await page.fill('textarea[name=memo]', 'テストメモ');

    // 追加ボタン押下
    await page.getByRole('button', { name: '追加する' }).click();

    // テーブルに行が追加されるまで待つ（1件以上の行があることを確認）
    const rows = page.locator('table > tbody > tr');
    await expect(rows).toHaveCount(1, { timeout: 5000 }); // より柔軟に

    // セルごとに部分一致で検証
    const cells = rows.last().locator('td');

    // 各セルの内容を個別に検証（行の構成が一定である前提）
    await expect(cells.nth(0)).toContainText('8/5/2025'); // 日付（部分一致でOK）
    await expect(cells.nth(1)).toHaveText('支出');
    await expect(cells.nth(2)).toHaveText('食費');
    await expect(cells.nth(3)).toHaveText('食料品');
    await expect(cells.nth(4)).toHaveText('-5,000円');
    await expect(cells.nth(5)).toHaveText('-5,000円');
    await expect(cells.nth(6)).toHaveText('テストメモ');
  });

  test('追加した行を編集し、保存できる', async ({ page }) => {
    // まずは1件追加（上記の流れ）
    await page.selectOption('select[name=majorSelect]', 'expense');
    await page.selectOption('select[name=middleSelect]', 'food');
    await page.selectOption('select[name=minorSelect]', '食料品');
    await page.fill('input[name=amount]', '5000');
    await page.fill('textarea[name=memo]', 'テストメモ');

    // 追加ボタン押下
    await page.getByRole('button', { name: '追加する' }).click();

    // 編集ボタン押下
    await page.getByRole('button', { name: '編集する' }).click();

    // 価格変更
    await page.fill('input[name=amount]', '7000');
    // メモ変更
    await page.fill('textarea[name=memo]', '更新メモ');

    // 保存ボタン押下
    await page.getByRole('button', { name: '保存する' }).click();

    // 更新された内容を検証
    const lastRow = page.locator('table > tbody > tr').last();
    await expect(lastRow.locator('td')).toContainText(['7,000円', '更新メモ']);
  });

  test('編集をキャンセルできる', async ({ page }) => {
    // 1件追加
    await page.selectOption('select[name=majorSelect]', 'expense');
    await page.selectOption('select[name=middleSelect]', 'food');
    await page.selectOption('select[name=minorSelect]', '食料品');
    await page.fill('input[name=amount]', '5000');
    await page.fill('textarea[name=memo]', 'テストメモ');

    // 追加ボタン押下
    await page.getByRole('button', { name: '追加する' }).click();

    // 編集ボタン押下
    await page.getByRole('button', { name: '編集する' }).click();

    // 価格変更
    await page.fill('input[name=amount]', '7000');

    // キャンセル押下
    await page.getByRole('button', { name: 'キャンセル' }).click();

    // 元の内容のままか確認
    const lastRow = page.locator('table > tbody > tr').last();
    await expect(lastRow.locator('td')).toContainText(['5,000円', 'テストメモ']);
  });

  test('追加した行を削除できる', async ({ page }) => {
    // 1件追加
    await page.selectOption('select[name=majorSelect]', 'expense');
    await page.selectOption('select[name=middleSelect]', 'food');
    await page.selectOption('select[name=minorSelect]', '食料品');
    await page.fill('input[name=amount]', '5000');
    await page.fill('textarea[name=memo]', 'テストメモ');

    // 追加ボタン押下
    await page.getByRole('button', { name: '追加する' }).click();

    // 削除ボタン押下（確認ダイアログはaccept）
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('削除しますか');
      await dialog.accept();
    });
    await page.getByRole('button', { name: '削除する' }).click();

    // 行が削除されていることを確認
    await expect(page.locator('table > tbody > tr')).toHaveCount(0);
  });

  test('登録ボタン押下でAPIにデータを送信し成功する', async ({ page }) => {
    // APIリクエストをモック
    await page.route('http://localhost:5001/api/transactions/add/register', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      })
    );

    // 1件追加
    await page.selectOption('select[name=majorSelect]', 'expense');
    await page.selectOption('select[name=middleSelect]', 'food');
    await page.selectOption('select[name=minorSelect]', '食料品');
    await page.fill('input[name=amount]', '5000');
    await page.fill('textarea[name=memo]', 'テストメモ');
    
    // 追加ボタン押下
    await page.getByRole('button', { name: '追加する' }).click();

    // 登録ボタン押下
    await page.click('button:has-text("登録する")');
  });
});