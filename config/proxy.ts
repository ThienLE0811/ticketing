export default {
  dev: {
    '/api/': {
      target: 'url dev',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'url test',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'url seabank',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
