const {app, BrowserWindow} = require('electron')
const fork = require('child_process').fork
const config = require('../configuration/config-electron')

let win

function createWindow () {
  createChildProccess()
  win = new BrowserWindow({title: 'Hybrid Ontology Mapping Interface', show: false})
  win.loadURL('http://localhost:8000/')
  win.setMenu(null)
  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })
}

function createChildProccess () {
  let env = {
    dirname: __dirname,
    config: config,
    port: 8000
  }
  let options = {
    env: env
  }

  const childProccess = fork('../app.js', [], Object.create(options))
}

app.on('ready', createWindow)
