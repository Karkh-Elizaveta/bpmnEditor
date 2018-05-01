module.exports = {
  entry: {
    bundle: "./public/createBPMN.js",
    "open-bundle": "./public/open.js",
    "diff-bundle": "./public/diff.js"
  },
  output: {
    path: __dirname + '/public',
    filename: "[name].js"
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
