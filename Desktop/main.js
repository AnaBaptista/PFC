const {app, BrowserWindow} = require('electron')
const path = require('path')

let win;

function createWindow() {
    win = new BrowserWindow();
    win.loadURL('http://localhost:8000/')
    win.setMenu(null)
}

app.on('ready', createWindow)