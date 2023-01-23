// Generated using webpack-cli https://github.com/webpack/webpack-cli

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const isProduction = process.env.NODE_ENV == 'production'

const config = {
  target: 'node',
  entry: './src/index.ts',
  experiments: {
    outputModule: true
  },
  output: {
    chunkFormat: 'module',
    library: {
      type: 'module'
    },
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: ['/node_modules/']
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  }
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
  }
  return config
}
