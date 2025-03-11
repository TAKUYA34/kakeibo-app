# ベースイメージとして Node.js を使用
FROM node:18 AS build

WORKDIR /app

# 依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# ソースコードをコピー
COPY . .

CMD ["npm", "start"]