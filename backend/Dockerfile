FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
# backendのDockerfileにdockerizeを追加
RUN npm install
COPY . .
CMD ["npm", "start"]