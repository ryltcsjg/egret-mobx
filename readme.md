```
cd client
egret run -a -sourcemap

以下部分为更改libs内容重新打包时使用
cd egret-mobx
npm i -g webpack webpack-cli --unsafe-perm
cd libs
npm i
webpack
```