# Nginxの公式イメージを使用
FROM nginx:latest

# Nginxの設定ファイルをコピー
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# フロントエンドのビルド成果物をコピー
COPY ./frontend/build /usr/share/nginx/html

# コンテナ起動時にポート80を開放
EXPOSE 80