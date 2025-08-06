import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Footer コンポーネント E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
  });

  test('トップページにフッターが表示される', async ({ page }) => {
    // フッターが表示されていること
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // フッターのタイトルリンクが '/' であること
    const titleLink = footer.locator('h1 > a');
    await expect(titleLink).toHaveAttribute('href', '/');

    // クリックするとトップページに遷移
    await titleLink.click();
    await expect(page).toHaveURL(`${BASE_URL}/home`);
  });

  test('/home/register ページではフッターが非表示', async ({ page }) => {
    await page.goto(`${BASE_URL}/home/register`);

    const footer = page.locator('footer');
    await expect(footer).toHaveCount(0);
  });

  test('/home/login ページではフッターが非表示', async ({ page }) => {
    await page.goto(`${BASE_URL}/home/login`);

    const footer = page.locator('footer');
    await expect(footer).toHaveCount(0);
  });

  test('SNSリンクが新しいタブで開く設定である', async ({ page }) => {
    const footer = page.locator('footer');

    const snsLinks = [
      { href: 'https://x.com/' },
      { href: 'https://www.facebook.com/' },
      { href: 'https://www.instagram.com/' },
      { href: 'https://line.me/' },
    ];

    for (const { href } of snsLinks) {
      const link = footer.locator(`a[href="${href}"]`);
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('カスタマーサービスのリンクに正しいハッシュが含まれている', async ({ page }) => {
    const footer = page.locator('footer');

    const anchors = [
      '/home/info#kakeibo',
      '/home/info#question',
      '/home/info#policy',
      '/home/info#contact',
      '/home/info#privacy',
    ];

    for (const href of anchors) {
      const link = footer.locator(`a[href="${href}"]`);
      await expect(link).toHaveCount(1);
    }
  });
});