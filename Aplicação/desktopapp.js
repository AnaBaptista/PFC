const {app, BrowserWindow} = require('electron'),
  fork = require('child_process').fork,
  url =  'http://localhost:8000/'

let win
let childProcess

function createWindow () {
  createChildProccess()
  win = new BrowserWindow({title: 'Hybrid Ontology Mapping Interface', show: false})
  win.loadURL(url)
  win.setMenu(null)
  win.on('closed', () => {
      win = null
  })
  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })
}

function createChildProccess () {
  const config = require('./config/config-electron')
  let env = {
    dirname: __dirname,
    config: config,
    port: 8000
  }
  let options = {
    env: env
  }

  childProccess = fork('./bin/www', [], Object.create(options))
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (childProcess !== undefined) {
    childProcess.kill('SIGHUP')
  }
  app.quit()
})


app.on('activate', function () {
    if (win === null) {
        createWindow()
    }
})
