const path = require('path');
const glob = require('glob');
const loaders = require('./loaders');
const plugins = require('./plugins');
const helpers = require('./helpers');

const getEntries = () => {
  entries = glob
    .sync(
      path.resolve(`${helpers.componentsDir}/**/{js,scss}/{index,styles}.{scss,js}`),
    )
    .reduce(
      (lib, path) => {
        let entry = path.split('/');
        // Extract output name and remove from array
        const extension = entry.pop();
        // Remove empty items
        entry = entry.slice(1);
        // Add key 'folder' + 'output name'
        lib[`components+${entry.join('+')}+${extension}`] = path;
        return lib;
      },
      {
        base: path.resolve(`./docroot/themes/custom/sideshow/sass/index.scss`),
        sideshow: path.resolve(`./docroot/themes/custom/sideshow/js/sideshow.js`),
        // drupal: path.resolve(`${helpers.componentsDir}/drupal.scss`), // logged in style overrides
        // jquery_ui: path.resolve(`${themeDir}/lib/jquery.ui/theme.scss`), // jquery ui theme styles
        // jquery_dialog: path.resolve(`${themeDir}/lib/jquery.ui/dialog.scss`), // dialog styles
        // This may be needed for IE, leaving commented out for now
        // ...mapFilenamesToEntries(
        //   path.resolve(
        //     `${helpers.componentsDir}/00-base/01-colors/_03-colors-css-vars.scss`,
        //   ),
        // ),
      },
    );

  return entries;
};

module.exports = {
  mode: 'production',
  stats: {
    preset: 'minimal',
    chunkGroups: true,
  },
  entry: getEntries(),
  optimization: {
    splitChunks: {
      name: false, // Providing false will keep the same name of the chunks so that it doesn't change names unnecessarily.
    },
  },
  output: {
    filename: (fileInfo) => {
      const dest = helpers.getDest(fileInfo);
      return `./${dest.folder}/${dest.name}.js`;
    },
    path: path.join(__dirname, '../docroot')
  },
  module: {
    rules: [
      loaders.CSSLoader,
      loaders.SVGSpriteLoader,
      loaders.ImageLoader,
      loaders.JSLoader,
    ],
  },
  plugins: [
    plugins.StyleLintPlugin,
    plugins.MiniCssExtractPlugin,
    // plugins.ESLintPlugin,
    plugins.ImageminPlugin,
    plugins.SpriteLoaderPlugin,
    plugins.ProgressPlugin,
    plugins.CleanWebpackPlugin,
    plugins.DotEnv,
    plugins.HtmlBundlerPlugin,
  ],
  // watch: true,
  watchOptions: {
    ignored: ['**/node_modules'],
  },
};
