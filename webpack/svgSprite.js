function requireAll(svgs) {
  svgs.keys().forEach(svgs);
}

requireAll(
  require.context(
    '../docroot/themes/custom/${theme}/images/icons',
    true,
    /\.svg$/,
  ),
);
