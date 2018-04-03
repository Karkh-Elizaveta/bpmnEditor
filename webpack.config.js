module.exports = {
  entry: "./public/createBPMN.js",
  output: {
    path: __dirname + '/public',
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: ['url-loader']
      }
    ]
  }
};
