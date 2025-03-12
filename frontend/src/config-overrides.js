// config-overrides.js
module.exports = function override(config, env) {
  if (env === 'development') {
    config.devServer.setupMiddlewares = (middlewares, devServer) => {
      // ここにカスタムミドルウェアの設定を追加
      return middlewares;
    };
  }
  return config;
};