module.exports = {
  publicPath: process.env.NODE_ENV === 'production'? '/app/population-choropleth/' : '/',
  configureWebpack: {
    devServer: {
      disableHostCheck: true
    }
  }
}