module.exports = {
  publicPath: process.env.NODE_ENV === 'production'? '/app/us-county-choropleth/' : '/',
  configureWebpack: {
    devServer: {
      disableHostCheck: true,
    },
  },
};
