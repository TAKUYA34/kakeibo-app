## 機能設計
#### 一般ユーザー
| features(機能)      | detail(詳細)                    |
|:-------------------|:--------------------------------|
| **ユーザー認証(完成)**      | ユーザー登録／ログイン／ログアウト    |
| **プロフィール編集(完成)**      | ユーザー情報編集／ユーザー情報削除    |
| **取引追加(完成)**         | 収支・支出の登録／削除         |
| **在庫管理(検討中)**         | 在庫管理を作成／編集／削除 |
| **取引一覧 データ検索・フィルタ(完成)** | 期間・カテゴリ・金額範囲で検索       |
| **収支の可視化(完成)**      | 月毎の収支・支出のグラフ表示         |
| **データのエクスポート(完成)** | CSVやPDFに書き出し                |

## データ構造

| entity(データの種類)          | field(データ名)                      | 詳細                |
|:----------------------------|:------------------------------------|:------------------|
| **User**                    | user_id（PK）, user_name, email, password, created_at, update_at, role[user, admin]            | ユーザーID、ユーザーネーム、メールアドレス、パスワード、登録日時、更新日時、[ユーザー, 管理者]  |
| **Transaction**             | transaction_id（PK）, user_id（FK）, category_id（FK）,trans_type[income, expense], amount, total_amount | 取引ID、取引するユーザーID、カテゴリID、[収入, 支出]、金額、合計金額 |
| **Transaction**             | memo, major_sel, middle_sel, minor_sel, create_at, update_at           | [収入, 支出]、詳細、大項目、中項目、小項目、取引年月、登録日時、更新日時  |
| **Category（検討中）**                | category_id（PK）, user_id（FK）, category_name, category_type[income, expense] |  カテゴリID、ユーザー毎にカスタム、〇〇費、[収入、支出]

## API設計

| method      | endpoint                | explanation            |
|:------------|:------------------------|:-----------------------|
| POST        | /home/register      | ユーザー登録画面          |
| POST        | /home/login         | ログイン画面             |
| GET         | /home/logout        | ログアウト               |
| GET         | /home/profile        | ユーザー情報画面               |
| PUT         | /home/profile/edit:id        | ユーザー情報編集               |
| DELETE         | /home/profile/delete:id        | ユーザー情報削除               |
| GET         | /home/transaction/list   | 取引一覧画面取得             |
| POST        | /home/transaction/list/search   | 取引一覧画面検索             |
| GET         | /home/transaction/add       | 取引追加画面             |
| POST        | /home/transaction/add/register       | 取引追加画面追加             |
| DELETE      | /home/transactions/delete:id    | 取引追加画面削除             |
| GET         | /home/inventory         | 在庫管理画面          |
| POST        | /home/inventory/edit:id      | 在庫管理画面編集          |
| DELETE      | /home/inventory/delete:id      | 在庫管理画面削除          |
| GET         | /home/export/csv         | CSVエクスポート          |
| GET         | /home/export/pdf         | PDFエクスポート          |

## 画面設計

| window(画面)                  | explanation(説明)                   |
|:-----------------------------|:-----------------------------------|
| **ログイン／新規登録画面**        | ユーザーがログイン・登録を行う          |
| **ホーム画面**                  | 収支の概要やグラフを表示               |
| **プロフィール画面**                  | ユーザーの情報を表示               |
| **取引一覧画面**                | 取引の一覧表示・検索・編集・削除             | 
| **取引追加画面**                | 新しい収入・支出を複数記録・削除                |
 | **在庫管理画面**             | 在庫管理表の作成・編集・削除             |

-------------------
## 機能設計
#### 管理者

 | features(機能)      | detail(詳細)                    |
|:-------------------|:--------------------------------|
| **管理者認証**      | ログイン／ログアウト    |
| **ユーザー全体の統計** | 全体の概要／統計       |
| **ユーザー管理**      | ユーザー一覧と編集／削除 |
| **全取引一覧**       | 全ユーザーの取引一覧    |
| **お知らせ**         | トップ画面に表示される内容の編集         |
| **システム設定(仮)**  | アプリの基本設定や運用制御                |

## データ構造
**既存テーブルを流用する**

## API設計

| method      | endpoint                | explanation            |
|:------------|:------------------------|:-----------------------|
| GET         | admin/home   | 管理者画面             |
| POST        | admin/home/login         | ログイン画面             |
| GET         | admin/home/logout        | ログアウト               |
| GET        | admin/home/users   | ユーザー管理画面             |
| POST         | admin/home/users/edit:id       | ユーザー編集             |
| POST        | admin/home/users/delete:id       | ユーザー削除             |
| GET         | admin/home/transactions/allList    | 全取引一覧画面             |
| GET         | admin/home/dashboard         | お知らせ管理画面          |
| POST        | admin/home/dashboard/edit:id      | お知らせ編集          |
| GET      | admin/home/options      | システム設定画面          |

## 画面設計

| window(画面)                  | explanation(説明)                   |
|:-----------------------------|:-----------------------------------|
| **ログイン画面**                 | 管理者がログインを行う          |
| **管理者画面**                  | ユーザー全体の概要／統計を表示               |
| **ユーザー管理画面**                | 取引の一覧表示・検索・編集・削除             | 
| **全取引一覧画面**                | 新しい収入・支出を複数記録・削除                |
 | **お知らせ管理画面**             | お知らせ管理表の作成・編集・削除             |
| **システム設定画面(仮)** | アプリの基本設定や運用制御                |

