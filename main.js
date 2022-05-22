const express = require('express')

const ex = express()
const server = ex.listen(3000)

const fs = require('fs')
const path = require('path')
const url = require('url')

ex.get('/', function(req, res) {
    res.send('ok')
})

const { app, BrowserWindow } = require('electron')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 576,
        frame: true,
        fullscreen: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webviewTag: true,
        }
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, `./dist/index.html`),
        protocol: "file:",
        slashes: true
    }))

    const session = mainWindow.webContents.session
    session.on('will-download', (event, item, webContents) => {
        event.preventDefault()
    })
    
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

// new window blocker
app.on('web-contents-created', function (webContentsCreatedEvent, contents) {
    if (contents.getType() === 'webview') {
        contents.on('new-window', function (newWindowEvent, url) {
            newWindowEvent.preventDefault()
        })
    }
})

app.on('window-all-closed', function () {
    app.quit()
})