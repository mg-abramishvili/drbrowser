const express = require('express')
const ex = express()
const server = ex.listen(3000)

const fs = require('fs')
const path = require('path')
const url = require('url')
const { app, BrowserWindow } = require('electron')

const configuration = JSON.parse(fs.readFileSync('configuration.json'))

let updatedConfiguration = configuration

ex.use(express.static('browser_settings/dist'))
ex.get('/', function(req, res) {
    res.sendFile('browser_settings/dist/index.html')
})

ex.get('/configuration', function(req, res) {
    res.send(configuration)
})

ex.use(express.json())
ex.post('/domain', function(req, res) {
    updatedConfiguration.whitelist.push(req.body.name)
    
    fs.writeFileSync('configuration.json', JSON.stringify(updatedConfiguration))

    res.sendStatus(200)
})

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
        pathname: path.join(__dirname, `./public/index.html`),
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