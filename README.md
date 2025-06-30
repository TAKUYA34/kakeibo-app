## 機能設計

| features(機能)      | detail(詳細)                    |
|:-------------------|:--------------------------------|
| **ユーザー認証**      | ユーザー登録／ログイン／ログアウト    |
| **取引追加**         | 収支・支出の登録／削除         |
| **在庫管理**         | 在庫管理を作成／編集／削除 |
| **取引一覧 データ検索・フィルタ** | 期間・カテゴリ・金額範囲で検索       |
| **収支の可視化**      | 月毎の収支・支出のグラフ表示         |
| **データのエクスポート** | CSVやPDFに書き出し                |
| **設定機能**         | 通貨単位変更、データリセット         |

## データ構造

| entity(データの種類)          | field(データ名)                      | 詳細                |
|:----------------------------|:------------------------------------|:------------------|
| **User**                    | user_id（PK）, user_name, email, password, created_at, update_at            | ユーザーID、ユーザーネーム、メールアドレス、パスワード、登録日時、更新日時  |
| **Transaction**             | transaction_id（PK）, user_id（FK）, category_id（FK）,trans_type[income, expense], amount, total_amount | 取引ID、取引するユーザーID、カテゴリID、[収入, 支出]、金額、合計金額 |
| **Transaction**             | cost_type[fixed, variable], memo, trans_date, create_at, update_at           | [収入, 支出]、詳細、取引年月、登録日時、更新日時  |
| **Category**                | category_id（PK）, user_id（FK）, category_name, category_type[income, expense] |  カテゴリID、ユーザー毎にカスタム、〇〇費、[収入、支出]

## API設計

| method      | endpoint                | explanation            |
|:------------|:------------------------|:-----------------------|
| POST        | /home/register      | ユーザー登録画面          |
| GET        | /home/login         | ログイン画面             |
| GET        | /home/logout        | ログアウト               |
| GET         | /home/transaction/list   | 取引一覧画面取得             |
| GET         | /home/transaction/list/search   | 取引一覧画面検索             |
| GET         | /home/transaction/add       | 取引追加画面             |
| POST        | /home/transaction/add/register       | 取引追加画面追加             |
| DELETE      | /home/transactions/delete:id    | 取引追加画面削除             |
| GET         | /home/inventory         | 在庫管理画面          |
| PUT         | /home/inventory/edit:id      | 在庫管理画面編集          |
| DELETE      | /home/inventory/delete:id      | 在庫管理画面削除          |
| GET         | /home/analytics/summary  | 収支データ取得            |
| GET         | /home/export/csv         | CSVエクスポート          |
| GET         | /home/export/pdf         | PDFエクスポート          |

## 画面設計

| window(画面)                  | explanation(説明)                   |
|:-----------------------------|:-----------------------------------|
| **ログイン／新規登録画面**        | ユーザーがログイン・登録を行う          |
| **ホーム画面**                  | 収支の概要やグラフを表示               |
| **取引一覧画面**                | 取引の一覧表示・検索・編集・削除             | 
| **取引追加画面**                | 新しい収入・支出を複数記録・削除                |
 | **在庫管理画面**             | 在庫管理表の作成・編集・削除             |
