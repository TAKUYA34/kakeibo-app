## 機能設計

| features(機能)      | detail(詳細)                    |
|:-------------------|:--------------------------------|
| **ユーザー認証**      | ユーザー登録／ログイン／ログアウト    |
| **収支記録**         | 収支・支出の登録／編集／削除         |
| **カテゴリ管理**       | 収支・支出のカテゴリを作成／編集／削除 |
| **データ検索・フィルタ** | 期間・カテゴリ・金額範囲で検索       |
| **収支の可視化**      | 月毎の収支・支出のグラフ表示         |
| **データのエクスポート** | CSVやPDFに書き出し                |
| **設定機能**         | 通貨単位変更、データリセット         |

## データ構造

| entity(データの種類)          | field(データ名)                      | 詳細                |
|:----------------------------|:------------------------------------|:------------------|
| **User**                    | user_id（PK）, user_name, email, password, created_at, update_at            | ユーザーID、ユーザーネーム、メールアドレス、パスワード、登録日時、更新日時  |
| **Transaction**             | transaction_id（PK）, user_id（FK）, category_id（FK）,trans_type[income, expense], amount,  | 取引ID、取引するユーザーID、カテゴリID、[収入, 支出]、金額  |
| **Transaction**             | memo, trans_date, create_at, update_at           | 詳細、取引日、登録日時、更新日時  |
| **Category**                | category_id（PK）, user_id（FK）, category_name, category_type[income, expense] |  カテゴリID、ユーザー毎にカスタム、〇〇費、[収入、支出]

## API設計

| method      | endpoint                | explanation            |
|:------------|:------------------------|:-----------------------|
| POST        | /api/auth/register      | ユーザー登録画面          |
| POST        | /api/auth/login         | ログイン画面             |
| POST        | /api/auth/logout        | ログアウト               |
| GET         | /api/transactions       | 収支記録取得             |
| POST        | /api/transactions       | 収支記録追加             |
| PUT         | /api/transactions:id    | 収支記録編集             |
| DELETE      | /api/transactions:id    | 収支記録削除             |
| GET         | /api/categories         | カテゴリ管理取得          |
| POST        | /api/categories         | カテゴリ管理追加          |
| PUT         | /api/categories:id      | カテゴリ管理編集          |
| DELETE      | /api/categories:id      | カテゴリ管理削除          |
| GET         | /api/analytics/summary  | 収支データ取得            |
| GET         | /api/export/csv         | CSVエクスポート          |
| GET         | /api/export/pdf         | PDFエクスポート          |

## 画面設計

| window(画面)                  | explanation(説明)                   |
|:-----------------------------|:-----------------------------------|
| **ログイン／新規登録画面**        | ユーザーがログイン・登録を行う          |
| **ホーム画面**                  | 収支の概要やグラフを表示               |
| **取引一覧画面**                | 取引の一覧表示・編集・削除             | 
| **取引追加画面**                | 新しい収入・支出を記録                |
 | **カテゴリ追加画面**             | カテゴリの作成・編集・削除             |