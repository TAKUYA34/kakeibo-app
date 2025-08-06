import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('プロフィール編集画面 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    // APIモック - プロフィール更新API
    await page.route('**/api/home/profile/edit', async route => {
      // 常に成功レスポンスを返す（ダミー）
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'プロフィール更新成功' }),
      });
    });

    // APIモック - プロフィール削除API
    await page.route('**/api/home/profile/delete', async route => {
      // 常に成功レスポンスを返す（ダミー）
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'アカウントを削除しました' }),
      });
    });

    // ログイン画面のURLにアクセス
    await page.goto(`${BASE_URL}/home/login`);

    // メールとパスワードを入力
    await page.getByLabel('メールアドレス').fill('itadori@co.jp');
    await page.getByLabel('パスワード').fill('itadoriedit');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // 遷移確認
    await expect(page).toHaveURL(`${BASE_URL}/home`);

    // 帳票出力画面へ
    await page.goto(`${BASE_URL}/home/profile`);
  });

  test('初期表示が正しくされる', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
    await expect(page.getByLabel('お名前')).toHaveValue(/.+/);
    await expect(page.getByLabel('メールアドレス')).toHaveValue(/.+@.+/);
  });

  test('変更なしで更新するとエラーが出る', async ({ page }) => {
    // 空のまま送信
    await page.getByRole('button', { name: '更新する' }).click();

    // メッセージ確認
    await expect(page.getByText('名前とメールアドレスが変更されていません')).toBeVisible();
  });

  test('プロフィールを正常に更新できる（テストではダミーデータで試験する）', async ({ page }) => {
    await page.getByLabel('お名前').fill('ダミー更新');
    await page.getByLabel('パスワード').fill('dummyPass123');

    await page.getByRole('button', { name: '更新する' }).click();

    // トーストが出るのを確認（更新はされた前提）
    await expect(page.getByText('プロフィールを更新しました')).toBeVisible();

    // ページリロード（更新内容を反映させず破棄）
    await page.reload();

    // 元の内容に戻っていること
    await expect(page.getByLabel('お名前')).not.toHaveValue('ダミー更新');
  });

  test('削除ボタンを押すと削除される（テストではダミーデータで試験する）', async ({ page }) => {
    // ダイアログ OK を押す
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('本当にアカウントを削除しますか？');
      await dialog.accept();
    });

    // 削除ボタンをクリック
    await page.getByRole('button', { name: '削除する' }).click();

    // 成功トーストが表示されることを確認（ダミー成功）
    await expect(page.getByText('アカウントを削除しました')).toBeVisible();
  });

  test('削除ボタン押した後、キャンセル押しても何もしない', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('本当にアカウントを削除しますか？');
      await dialog.dismiss(); // キャンセル
    });

    await page.getByRole('button', { name: '削除する' }).click();
  });
});