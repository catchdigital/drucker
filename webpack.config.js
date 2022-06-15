const path = require('path');
const Dotenv = require('dotenv-webpack');
const FractalWebpackPlugin = require('fractal-webpack-plugin');

module.exports = {
  mode: 'production',
  stats: {
    preset: 'minimal',
    chunkGroups: true,
  },
  entry: {
    main: {
      import: path.join(__dirname, "docroot/themes/custom/${theme}/js", "index.js"),
    },
    styles: {
    import: path.join(__dirname, "docroot/themes/custom/${theme}/js", "index.js"),
    },
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: false // Providing false will keep the same name of the chunks so it doesn't change names unnecessarily
    },
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, "docroot/themes/custom/${theme}/build"),
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(txt|csv|mmdb)$/,
        use: ['raw-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: '.env',
      example: '.env.example', // load .env.example if no path
    }),
    new FractalWebpackPlugin({
      mode: 'build',
    }),
  ],
  devServer: {
    host: 'drucker.local',
    server: 'spdy',
    hot: true,
    liveReload: true,
    watchFiles: './docroot/themes/custom/${theme}',
    static: [{
      directory: path.join(__dirname, 'app-build'),
      serveIndex: true,
      watch: false,
    }]
  }
}
