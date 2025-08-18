# ベースイメージとして公式nginxを使用
FROM nginx:alpine

ARG NGINX_CONF=dev.conf

# Nginx設定ファイルをコピー（nginx.confなど）
COPY ./nginx.conf /etc/nginx/nginx.conf

# conf.dの中の各種ルーティング設定もコピー
COPY ./conf.d/$NGINX_CONF /etc/nginx/conf.d/default.conf