import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('ユーザー管理画面 E2Eテスト', () => {
  let baseUrl;

  test.beforeEach(async ({ page }) => {
    const adminEmail = 'zhuoshanben281@gmail.com';
    // 末尾に!を付けることで常にstring型で受け取れる
    const adminPassword = process.env.ADMIN_PASSWORD!;

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
    await page.goto(`${BASE_URL}/admin/home/users`);
  });

  test('ユーザー一覧が表示される', async ({ page }) => {
    // APIモック: GET /api/admin/home/users
    await page.route('**/api/admin/home/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: '1',
            user_name: 'TestUser1',
            email: 'test1@example.com',
            role: 'admin',
            is_logged_in: true,
          },
          {
            _id: '2',
            user_name: 'TestUser2',
            email: 'test2@example.com',
            role: 'user',
            is_logged_in: false,
          },
        ]),
      });
    });

    await expect(page.getByRole('heading', { name: 'Users Management' })).toBeVisible();
    await expect(page.locator('table > tbody > tr')).toHaveCount(2);

    // ユーザー名をチェック
    await expect(page.locator('table > tbody > tr').first().locator('td').first()).toHaveText('TestUser1');
  });

  test('ユーザー検索機能', async ({ page }) => {
    // 検索前の全件取得モック
    await page.route('**/api/admin/home/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { _id: '1', user_name: 'TestUser1', email: 'test1@example.com', role: 'admin', is_logged_in: true }
        ]),
      });
    });

    // 検索時POSTモック
    await page.route('**/api/admin/home/users/search', (route, request) => {
      const postData = JSON.parse(request.postData() || '{}');
      if (postData.name === 'TestUser2') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { _id: '2', user_name: 'TestUser2', email: 'test2@example.com', role: 'user', is_logged_in: false }
          ]),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // 検索語を入力して検索ボタン押下
    await page.fill('#userSearch', 'TestUser2');
    await page.getByRole('button', { name: '検索する' }).click(),

    // 検索結果が1件に変わることを確認
    await expect(page.locator('table > tbody > tr')).toHaveCount(1);
    await expect(page.locator('table > tbody > tr > td').first()).toHaveText('TestUser2');
  });

  test('編集モーダルの表示と更新', async ({ page }) => {
    // ユーザー一覧モック
    await page.route('**/api/admin/home/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { _id: '1', user_name: 'TestUser1', email: 'test1@example.com', role: 'admin', is_logged_in: true }
        ]),
      });
    });

    // 更新APIモック
    await page.route('**/api/admin/home/users/edit/1', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            _id: '1',
            user_name: 'UpdatedUser',
            email: 'updated@example.com',
            role: 'user',
            is_logged_in: true,
          },
        }),
      });
    });

    // 編集ボタンをクリック
    await page.getByRole('button', { name: '編集する' }).click(),

    // モーダルが表示されていることを確認する
    await expect(page.getByRole('heading', { name: 'ユーザー情報を編集' })).toBeVisible();

    // フォーム入力値を変更
    await page.fill('input[name="user_name"]', 'UpdatedUser');
    await page.fill('input[name="email"]', 'updated@example.com');
    await page.selectOption('select[name="role"]', 'user');

    // 更新ボタン押下
    await page.getByRole('button', { name: '更新する' }).click(),

    // テーブルのユーザー名が更新されているか確認
    await expect(page.locator('table > tbody > tr > td').first()).toHaveText('UpdatedUser');
  });

  test('削除確認ダイアログと削除処理', async ({ page }) => {
    // ユーザー一覧モック
    await page.route('**/api/admin/home/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { _id: '1', user_name: 'DeleteUser', email: 'delete@example.com', role: 'user', is_logged_in: false }
        ]),
      });
    });

    // 削除APIモック
    await page.route('**/api/admin/home/users/delete/1', route => {
      route.fulfill({ status: 200 });
    });

    // window.confirm を自動的に「OK」にする
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('DeleteUserさんを削除しますか？');
      await dialog.accept();
    });

    // 削除ボタンをクリック
    await page.getByRole('button', { name: '削除する' }).click(),

    // テーブル行が0件になることを期待
    await expect(page.locator('table > tbody > tr')).toHaveCount(0);
  });
});