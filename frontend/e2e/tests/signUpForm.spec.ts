import { test as base, expect } from '@playwright/test';

  // 文字リテラル定義
  type WaitStrategy = 'load' | 'commit';

  // 型定義
  type MyFixtures = {
    waitStrategy: WaitStrategy
  }
  // base.extendにフィクスチャを渡す
  const test = base.extend<MyFixtures>({
    waitStrategy: async ({ browserName }, use) => {
      const strategy: WaitStrategy = browserName === 'firefox' ? 'load' : 'commit';
      await use(strategy);
    },
  });

/* 新規登録 */
test.describe('新規登録画面 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 新規登録画面へ
    await page.goto('http://localhost:3000/home/register');
  });

  test('必要なフィールドがすべて入力され、正常に登録できる', async ({ page, waitStrategy }) => {
    // テスト用のダミーデータ
    const randomEmail = `user_${crypto.randomUUID()}@example.com`;
    const randomPassword = `password_${crypto.randomUUID().slice(0, 8)}`;

    // 入力
    await page.fill('#user_name', 'テストユーザー');
    await page.fill('#email', randomEmail);
    await page.fill('#password', randomPassword);
    await page.fill('#confirmPassword', randomPassword);

    // 登録ボタンクリック
    await Promise.all([
      page.waitForURL('**/home/login', { waitUntil: waitStrategy, timeout: 5000 }), // より厳密に
      page.getByRole('button', { name: '新規登録' }).click(),
    ]);

    // URLが正しく遷移したか
    await expect(page).toHaveURL('http://localhost:3000/home/login');

    // UIの確認（ログイン画面に確実にいるか）
    await expect(page.locator('h1')).toHaveText('Kakeibo-app');
  });

  test('未入力の場合はエラーが表示される', async ({ page }) => {
    await page.getByRole('button', { name: '新規登録' }).click()

    const error = await page.locator('text=すべてのフィールドを入力してください。');
    await expect(error).toBeVisible();
  });

  test('メールアドレスが無効な場合はバリデーションエラーになる', async ({ page }) => {
    await page.fill('#user_name', 'テストユーザー');
    await page.fill('#email', 'user@example.c');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.click('button[type="submit"]');

    const error = await page.locator('text=無効なメールアドレスです');
    await expect(error).toBeVisible();
  });

  test('パスワードが一致しない場合にエラーを表示する', async ({ page }) => {
    await page.fill('#user_name', 'テストユーザー');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'mismatch');
    await page.click('button[type="submit"]');

    const error = await page.locator('text=パスワードが一致しません');
    await expect(error).toBeVisible();
  });

  test('パスワードが6文字未満の場合にエラーを表示する', async ({ page }) => {
    await page.fill('#user_name', 'テストユーザー');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', '123');
    await page.fill('#confirmPassword', '123');
    await page.click('button[type="submit"]');

    const error = await page.locator('text=パスワードは6文字以上で入力してください');
    await expect(error).toBeVisible();
  });
});