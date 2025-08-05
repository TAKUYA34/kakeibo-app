import { test, expect } from '@playwright/test';

test.describe('パスワード再設定画面 E2Eテスト', () => {
  const resetUrl = 'http://localhost:3000/home/login/password/reset/confirm?token=dummy-token';

  test('フォーム入力とバリデーションエラーチェック', async ({ page }) => {
    await page.goto(resetUrl);

    // ページタイトル確認
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

    // 6文字未満のパスワード → エラーメッセージ
    await page.getByPlaceholder('新しいパスワードを設定してください').fill('abc');
    await page.getByPlaceholder('新しいパスワードを再入力してください').fill('abc');
    await page.getByRole('button', { name: 'リセットする' }).click();
    await expect(page.getByText('パスワードは6文字以上で入力してください')).toBeVisible();

    // パスワード不一致 → エラーメッセージ
    await page.getByPlaceholder('新しいパスワードを設定してください').fill('abcdef');
    await page.getByPlaceholder('新しいパスワードを再入力してください').fill('abcdefg');
    await page.getByRole('button', { name: 'リセットする' }).click();
    await expect(page.getByText('パスワードが一致しません。')).toBeVisible();
  });

  test('正常にパスワードがリセットされる', async ({ page }) => {
    await page.goto(resetUrl);

    // モックされたトークンで成功する想定
    await page.getByPlaceholder('新しいパスワードを設定してください').fill('abcdef');
    await page.getByPlaceholder('新しいパスワードを再入力してください').fill('abcdef');
    await page.getByRole('button', { name: 'リセットする' }).click();

    // 成功メッセージの確認
    await expect(page.getByText('パスワードがリセットされました。ログインしてください。')).toBeVisible();

    // ログイン画面リンクが表示される
    const loginLink = page.locator('a', { hasText: 'ログイン画面へ' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/home/login');
  });
});