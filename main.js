const express = require('express')
const ex = express()
const server = ex.listen(3000)

const fs = require('fs')
const path = require('path')
const url = require('url')
const exec = require('child_process').exec
const Alert = require("electron-alert")

const { app, BrowserWindow, globalShortcut } = require('electron')

const configuration = JSON.parse(fs.readFileSync(__dirname + '/configuration.json'))

let updatedConfiguration = configuration

ex.use(express.static(__dirname + '/browser_settings/dist'))
ex.get('/', function(req, res) {
    res.sendFile(__dirname + '/browser_settings/dist/index.html')
})

ex.get('/configuration', function(req, res) {
    res.send(updatedConfiguration)
})

ex.use(express.json())
ex.post('/settings', function(req, res) {
    updatedConfiguration = req.body.configuration
    
    fs.writeFileSync(__dirname + '/configuration.json', JSON.stringify(updatedConfiguration))

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

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout)
    })
}

app.on('ready', createWindow)

app.whenReady().then(() => {
    globalShortcut.register('F1', () => {
        let taskmgrAlert = new Alert()

        let swalOptions = {
            text: "Введите пароль",
            input: 'text',
            showCancelButton: true
        }

        let promise = taskmgrAlert.fireWithFrame(swalOptions, "Введите пароль", null, false);
        promise.then((result) => {
            if (result.value && result.value == '12345678') {
                app.exit(0)
            } else if (result.dismiss === Alert.DismissReason.cancel) {
                // canceled
            }
        })
    })

    globalShortcut.register('F2', () => {
        let taskmgrAlert = new Alert()

        let swalOptions = {
            text: "Введите пароль",
            input: 'text',
            showCancelButton: true
        }

        let promise = taskmgrAlert.fireWithFrame(swalOptions, "Delete file?", null, false);
        promise.then((result) => {
            if (result.value && result.value == '12345678') {
                execute('taskmgr', (output) => {})
            } else if (result.dismiss === Alert.DismissReason.cancel) {
                // canceled
            }
        })
    })
})

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