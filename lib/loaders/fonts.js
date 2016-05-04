module.exports = [
  {
    test: /\.woff(\?.*)?$/,
    loader: 'url',
    query: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype: 'application/font-woff'
    }
  },
  {
    test: /\.woff2(\?.*)?$/,
    loader: 'url',
    query: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype: 'application/font-woff2'
    }
  },
  {
    test: /\.ttf(\?.*)?$/,
    loader: 'url',
    query: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype: 'application/octet-stream'
    }
  },
  {
    test: /\.eot(\?.*)?$/,
    loader: 'file',
    query: {
      name: 'fonts/[name].[ext]'
    }
  },
  {
    test: /\.svg(\?.*)?$/,
    loader: 'url',
    query: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype: 'image/svg+xml'
    }
  }
]
