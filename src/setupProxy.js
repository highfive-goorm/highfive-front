const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/kakao',
    createProxyMiddleware({
      target: 'https://open-api.kakaopay.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/kakao': '', // "/kakao"를 제거하고 카카오페이 경로로
      },
    })
  );
};
