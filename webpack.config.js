var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var DEVELOPMENT = process.env.NODE_ENV === 'development';
var PRODUCTION = process.env.NODE_ENV === 'production';
//Remove varibale etc - DefinePlugin. Define process.env.NODE_ENV !== 'production', and UglifyJS will clear unnecessary strings
/*
plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
*/
//Use ES6 modules - webpack exports only necessary
//
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
      })
    ]
    : []

plugins.push(new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
  'Tether': 'tether',
  'window.Tether': 'tether',
  Popper: ['popper.js', 'default'],
}));
plugins.push(new CleanWebpackPlugin(['dist']));    
plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
//Chunk ids replace with unique hash
plugins.push(new webpack.HashedModuleIdsPlugin());    

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

const sassLoader = PRODUCTION
  ? ExtractTextPlugin.extract({
      use: [{
        loader: 'css-loader'
      }, {
        loader: 'postcss-loader', // Run post css actions
        options: {
          ident: 'postcss',
          plugins: function () { // post css plugins, can be exported to postcss.config.js
            return [
              require('precss'),
              require('autoprefixer')
            ];
          }
        }
      }, {
        loader: 'sass-loader' // compiles SASS to CSS
      }],
      fallback: "style-loader",
      filename: cssIdent+'.css',
    })
  : [{
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

//Use url-loader, svg-url-loader and image-webpack-loader to optimize them in webpack
const fileLoader = PRODUCTION
    ? [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[hash:12].[ext]'
        }
      },
      {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]?[hash:10]',
            publicPath: 'assets/',
            outputPath: '/'
          }
      }]
    : ['url-loader?limit=10000&name=images/[hash:12].[ext]']

const imageLoader = PRODUCTION
  ? [
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      }
    }
  ]
  : []


module.exports = {
  devtool: devtool, //source maps
  entry: { // Our source files
    main: './assets/js/app.js',
    //sass: './assets/scss/app.scss',
    //html: './assets/index.html'
  },
  output: { // Where to place generated script
    filename: PRODUCTION ? '[name].[hash:12].min.js' : 'bundle-[name].js',
    publicPath: PRODUCTION ? '/' : '/dist/', // Specify public folder for webpack-dev-server
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false,
            interpolate: true
          }
        }
      },
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
        use: fileLoader.concat(imageLoader)
      },
      {
        test: /\.css$/, use: cssLoader
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader',
      },
      {
        test: /\.(scss)$/, use: sassLoader
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