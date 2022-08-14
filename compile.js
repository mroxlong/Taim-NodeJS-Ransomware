const { compile } = require('nexe')

compile({
  input: 'index.js',
  resources:["./windows-wallpaper.js","./bg.png",'./node_modules'],
  build: true, //required to use patches
  targets:"x86",
  verbose:true,
  patches: [
    async (compiler, next) => {
      await compiler.setFileContentsAsync(
        'lib/new-native-module.js',
        'module.exports = 42'
      )
      return next()
    }
  ]
}).then(() => {
  console.log('success')
})