module.exports = {
  mode: "production",
  entry: __dirname + "/index.js", //项目入口
  // devtool: "source-map",
  output: {
    //webpack output
    path: __dirname + "/bin/mm",
    filename: "mm.js",
    libraryTarget: "umd"
  }
};
