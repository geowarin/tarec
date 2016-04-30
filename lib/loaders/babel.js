module.exports = [
  {
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      presets: [
        require.resolve("babel-preset-react"),
        require.resolve("babel-preset-es2015-webpack"),
        require.resolve("babel-preset-stage-0")
      ],
      cacheDirectory: true
    }
  }
];
