import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('全取引一覧画面 E2Eテスト', () => {
  let baseUrl;

  test.beforeEach(async ({ page }) => {
    const adminEmail = 'zhuoshanben281@gmail.com';
    // 末尾に!を付けることで常にstring型で受け取れる
    const adminPassword = process.env.ADMIN_PASSWORD!;

    // APIモック: GET /api/admin/home/users
    await page.route('**/api/admin/home/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'u1',
            user_name: 'TestUser1',
            email: 'test1@example.com',
            role: 'admin',
            is_logged_in: false,
          },
          {
            _id: 'u2',
            user_name: 'TestUser2',
            email: 'test2@example.com',
            role: 'user',
            is_logged_in: false,
          },
        ]),
      });
    });

    // モックAPI（読み込み・検索・編集・削除）
    await page.route('**/api/admin/home/dashboard', route => {
      const mockData = [
        {
          _id: 'tx1',
          user_id: {
            _id: 'u1',
            user_name: 'TestUser1',
          },
          trans_date: '2025-08-01T12:00:00Z',
          category_id: {
            category_major: 'expense',
            category_middle: 'diningOut',
            category_minor: 'ラーメン',
          },
          amount: 800,
          total_amount: 800,
          memo: 'ランチ',
        },
        {
          _id: 'tx2',
          user_id: {
            _id: 'u2',
            user_name: 'TestUser2',
          },
          trans_date: '2025-08-02T08:30:00Z',
          category_id: {
            category_major: 'expense',
            category_middle: 'transportation',
            category_minor: '定期券',
          },
          amount: 5000,
          total_amount: 5000,
          memo: '通勤定期',
        },
      ];

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData),
      });
    });

    await page.route('**/api/admin/home/dashboard/edit/tx1', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 200 });
      } else if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 200 });
      }
    });

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
    await page.goto(`${BASE_URL}/admin/home/dashboard`);
  });

  test('一覧が表示される', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table).toContainText('TestUser1');
    await expect(table).toContainText('TestUser2');
  });

  test('TestUser1で検索できる', async ({ page }) => {
    // API モックを定義
    await page.route('**/api/admin/home/dashboard/search', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'tx1',
            user_id: {
              _id: 'u1',
              user_name: 'TestUser1',
            },
            trans_date: '2025-08-01T12:00:00Z',
            category_id: {
              category_major: 'expense',
              category_middle: 'diningOut',
              category_minor: 'ラーメン',
            },
            amount: 800,
            total_amount: 800,
            memo: 'ランチ',
          },
        ]),
      });
    });

    // ユーザー管理画面へ
    await page.goto(`${BASE_URL}/admin/home/dashboard`);

    // ユーザー名で検索
    await page.getByPlaceholder('ユーザー名で検索').fill('TestUser1');
    await page.getByRole('button', { name: '検索する' }).click();

    // 結果を検証
    const rows = page.locator('table > tbody > tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('TestUser1');
  });

  test('編集できる', async ({ page }) => {
    // 編集ボタンをクリック
    const editButton = page.getByRole('button', { name: '編集する' }).first();
    await editButton.click();

    // フォームが表示されている
    const memoInput = page.getByLabel('メモ');
    await expect(memoInput).toBeVisible();
    await memoInput.fill('ランチ（編集済み）');

    await page.getByRole('button', { name: '更新する' }).click();

    // モックなので実際は変わってない事を確認する
    const table = page.locator('table');
    await expect(table).toContainText('通勤定期');
  });

  test('削除できる', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: '削除する' }).first();
    await deleteButton.click();

    // window.confirm を自動的に「OK」にする
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('TestUser2さんを削除しますか？');
      await dialog.accept();
    });

    // 削除はしてないから2件なのを確認する
    await expect(page.locator('table > tbody > tr')).toHaveCount(2);
  });
});
