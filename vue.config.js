module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_main.scss";
        `
      }
    }
  },
  devServer: {
    host: '0.0.0.0'
  }
};