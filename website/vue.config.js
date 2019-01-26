// vue.config.js
var fs = require('fs')

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    port: 3000,
    hotOnly: true
  },

  // https://cli.vuejs.org/zh/config/#pages
  pages: {
    index: {
      entry: 'src/room/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Room.Cafe'
    }
  }
}
