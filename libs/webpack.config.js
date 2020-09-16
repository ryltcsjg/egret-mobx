module.exports = {
  mode: 'production',
  entry: {
    mm: './index.js',
    'mm.min': './index.js',
  }, //项目入口
  devtool: 'source-map',
  output: {
    //webpack output
    path: __dirname + '/bin/mm',
    filename: '[name].js',
    libraryTarget: 'umd',
  },
};
