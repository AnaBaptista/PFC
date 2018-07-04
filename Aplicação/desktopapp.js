const {app, BrowserWindow} = require('electron')
const fork = require('child_process').fork
const config = require('./config/config-electron')

let win
let childProcess

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

  childProccess = fork('./app.js', [], Object.create(options))
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (childProcess !== undefined) {
    childProcess.kill('SIGHUP')
  }
  app.quit()
})
