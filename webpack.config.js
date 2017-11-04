var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var DEVELOPMENT = process.env.NODE_ENV === 'development';
var PRODUCTION = process.env.NODE_ENV === 'production';

var plugins = PRODUCTION
    ? [
      new webpack.optimize.UglifyJsPlugin({
        comments: true,
        mangle: false,
        compress: {
          warnings: true
        }
      }),
      new ExtractTextPlugin('styles-[contenthash:10].css'),
      new HTMLWebpackPlugin({
        template: 'assets/html/index-template.html'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'Tether': 'tether',
        'window.Tether': 'tether',
        Popper: ['popper.js', 'default'],
      })
    ]
    : [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'Tether': 'tether',
        'window.Tether': 'tether',
        Popper: ['popper.js', 'default'],
      })
    ]

const devtool = PRODUCTION
    ? 'eval'
    : 'source-map'

    
const cssIdent = PRODUCTION
  ? '[hash:base64:10]'
  : '[path][name]--[local]'

const cssLoader = PRODUCTION
? ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: 'css-loader?localIdentName='+cssIdent
  })
: ['style-loader', 'css-loader?localIdentName='+cssIdent, {
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')]
  }
}]

module.exports = {
  devtool: devtool,
  entry: [
    './assets/js/app.js',
    './assets/scss/app.scss'
  ], // Our source script
  output: { // Where to place generated script
    filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js',
    publicPath: PRODUCTION ? '/' : '/dist/', // Specify public folder for webpack-dev-server
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Run the loader on all .js files
        exclude: /node_modules/, // ignore all files in the node_modules folder
        use: {
          loader: 'jshint-loader'
        }
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },{
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        exclude: /node_modules/,
        use: ['url-loader?limit=10000&name=images/[hash:12].[ext]']
      },
      {
        test: /\.css$/, use: cssLoader
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader' // compiles SASS to CSS
        }]
      },
      // Bootstrap 4
      {
        test: /bootstrap\/dist\/js\/umd\//, 
        use: 'imports-loader?jQuery=jquery'
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules"
    ]
  },
  plugins: plugins
};