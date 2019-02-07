// vue.config.js
var fs = require('fs')

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: 'dev.room.cafe',
    port: 3000,
    hotOnly: true,
    https: {
      key: fs.readFileSync('../certificate/dev.room.cafe.key'),
      cert: fs.readFileSync('../certificate/dev.room.cafe.crt')
    }
  },

  // https://cli.vuejs.org/zh/config/#pages
  pages: {
    index: {
      entry: 'src/room/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Room.Cafe'
    }
  },

  lintOnSave: undefined
}
