const {app, BrowserWindow} = require('electron')
const proc = require('child_process')

/**
 * If you want generate the .exe file
 * Windows or Linux - uncomment the first line
 * MAC - uncomment the second line
 */
const node = proc.spawn('node', ['./resources/app/express/bin/www'])
// const node = proc.spawn('node', ['./Electron.app/Contents/Resources/app/express/bin/www'])


/**
 * Run desktop app
 */
//const node = proc.spawn('node', ['./express/bin/www'])

let win

function createWindow () {
  win = new BrowserWindow({
    title: 'Hybrid Ontology Mapping Interface',
    show: false,
    autoHideMenuBar: true
  })

  win.loadURL('http://localhost:8000/')
  win.on('closed', () => {
    win = null
  })
  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })
}

app.on('ready', createWindow)
app.on('browser-window-created', (e, window) => {
  window.setMenu(null)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  node.kill('SIGINT')
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})

