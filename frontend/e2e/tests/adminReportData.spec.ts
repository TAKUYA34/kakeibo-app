import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('全取引一覧画面 E2Eテスト', () => {
  let baseUrl;

  test.beforeEach(async ({ page }) => {
    const adminEmail = 'zhuoshanben281@gmail.com';
    // 末尾に!を付けることで常にstring型で受け取れる
    const adminPassword = process.env.ADMIN_PASSWORD!;

    await page.route('**/api/admin/notices/all**', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          notices: [
            {
              _id: 'test_id_1',
              title: 'テストタイトル',
              content: 'テスト内容',
              notice_date: new Date().toISOString(),
            },
          ],
          page: 1,
          totalPages: 1,
        }),
      })
    );

    // 管理者ログインページへ
    await page.goto(`${BASE_URL}/admin/login`);

    // ログイン情報入力
    await page.getByLabel('メールアドレス').fill(adminEmail);
    await page.getByLabel('パスワード').fill(adminPassword);
    // console.log('adminEmail', adminEmail);
    // console.log('adminPassword', adminPassword);

    // 送信（リダイレクト待機）
    await Promise.all([
      page.waitForURL('**/admin/home', { waitUntil: 'load' }),
      page.getByRole('button', { name: 'ログイン' }).click(),
    ]);

    // 遷移先確認
    baseUrl = await expect(page).toHaveURL(`${BASE_URL}/admin/home`);

    // ユーザー管理画面へ
    await page.goto(`${BASE_URL}/admin/home/report`);
  });

  test('お知らせ一覧が表示される', async ({ page }) => {
    await expect(page.getByText('テストタイトル')).toBeVisible();
    await expect(page.getByText('テスト内容')).toBeVisible();
  });

  test('お知らせを投稿できる', async ({ page }) => {
    await page.route('**/api/admin/notices/register', async route => {
      const req = await route.request().postDataJSON();
      expect(req.title).toBe('投稿テストタイトル');
      expect(req.content).toBe('投稿テスト内容');
      await route.fulfill({ status: 201 });
    });

    await page.getByPlaceholder('お知らせ').fill('投稿テストタイトル');
    await page.getByPlaceholder('◯◯の機能を追加しました').fill('投稿テスト内容');
    await page.getByRole('button', { name: '投稿する' }).click();
  });

  test('お知らせを編集・更新できる', async ({ page }) => {
    await page.getByRole('button', { name: '編集する' }).click();

    await expect(page.getByPlaceholder('お知らせ')).toHaveValue('テストタイトル');
    await expect(page.getByPlaceholder('◯◯の機能を追加しました')).toHaveValue('テスト内容');

    await page.route('**/api/admin/notices/edit/test_id_1', async route => {
      const req = await route.request().postDataJSON();
      expect(req.title).toContain('更新後');
      await route.fulfill({ status: 200 });
    });

    await page.getByPlaceholder('お知らせ').fill('テストタイトル（更新後）');
    await page.getByRole('button', { name: '更新する' }).click();
  });

  test('お知らせを削除できる', async ({ page }) => {
    await page.once('dialog', dialog => dialog.accept());

    await page.route('**/api/admin/notices/delete/test_id_1', route =>
      route.fulfill({ status: 204 })
    );

    await page.getByRole('button', { name: '削除する' }).click();

    // 削除後に空一覧を表示
    await page.route('**/api/admin/notices/all', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ notices: [], page: 1, totalPages: 1 }),
      })
    );

    await expect(page.locator('input')).not.toContainText('テストタイトル');
  });
});
