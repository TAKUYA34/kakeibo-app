import { defineConfig } from '@playwright/test';

export default defineConfig({
  // テストファイルがあるフォルダ
  testDir: './e2e',
  // 各テストのタイムアウト（ミリ秒）
  timeout: 30 * 1000,
  // 失敗時の再試行回数（CIでは1以上にしてもOK）
  retries: 0,

  /* playwrightの設定 */
  use: {
    // Reactアプリの起動URL
    baseURL: 'http://localhost:3000',
    // ヘッドレス（ブラウザUIを表示しない）
    headless: true,
    // 画面サイズ
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // 失敗時の動画記録（デバッグ用）
    video: 'retain-on-failure',
    // 失敗時、スクリーンショットを描写
    screenshot: 'only-on-failure',
  },

  /* 各ブラウザの設定 */
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: true,
       },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],

  // 実行前にReact起動
  webServer: {
    // Reactアプリを起動するコマンド
    command: 'npm run start',
    // 起動するポート
    port: 3000,
    // ローカル開発時は既存のサーバを使う
    reuseExistingServer: !process.env.CI,
  },
});