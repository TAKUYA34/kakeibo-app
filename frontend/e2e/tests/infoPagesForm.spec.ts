import { test, expect } from '@playwright/test';

test('問い合わせフォームから送信できる', async ({ page }) => {
  // フォーム画面に遷移
  await page.goto('http://localhost:3000/home/info#contact');

  // スクロールが完了するまで待つ
  await page.waitForTimeout(500);

  // 各フィールドを入力
  await page.getByLabel('お名前').fill('テスト22号');
  await page.getByLabel('メールアドレス').fill('test22@co.jp');
  await page.getByLabel('件名').fill('E2Eテスト');
  await page.getByLabel('お問い合わせ内容').fill('これは自動テストからの問い合わせです。');

  // 送信ボタンクリック
  await page.getByRole('button', { name: '送信する' }).click();

  // 成功メッセージが表示されるか確認
  await expect(page.getByText('お問い合わせを受け付けました。')).toBeVisible();
});