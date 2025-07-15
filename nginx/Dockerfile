# ベースイメージとして公式nginxを使用
FROM nginx:alpine

# Nginx設定ファイルをコピー（nginx.confなど）
COPY ./nginx.conf /etc/nginx/nginx.conf

# conf.dの中の各種ルーティング設定もコピー（任意）
COPY ./conf.d /etc/nginx/conf.d