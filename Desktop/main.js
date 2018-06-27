const {app, BrowserWindow} = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({title: 'Hybrid Ontology Mapping Interface', show: false})
  win.loadURL('http://localhost:8000/')
  win.setMenu(null)
  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })
}

app.on('ready', createWindow)
