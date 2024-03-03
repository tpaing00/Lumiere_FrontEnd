const path = require('path');
const webpack = require('webpack');
module.exports = {
mode:"development",
devtool:"source-map",
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins:[
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
    module: {
        rules: [
            {
              test:/\.css$/,
              use:['style-loader', 'css-loader']
            },
            { test: /\.m?js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react' ]
                }
              }
            }

        ]
    }

};
