const express = require('express')
const ex = express()
const server = ex.listen(3000)

const fs = require('fs')
const path = require('path')
const url = require('url')
const exec = require('child_process').exec
const Alert = require("electron-alert")

const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')

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
        frame: false,
        fullscreen: true,
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

app.whenReady().then(() => {
    globalShortcut.register('F1', () => {
        functionButton('F1')
    })

    globalShortcut.register('F2', () => {
        functionButton('F2')
    })

    globalShortcut.register('F3', () => {
        functionButton('F3')
    })
})

app.on('web-contents-created', function (webContentsCreatedEvent, contents) {
    if(contents.getType() === 'webview') {
        ipcMain.on('kb', (e, msg) => {
            contents.sendInputEvent({ type: 'keyDown', keyCode: msg })
            contents.sendInputEvent({ type: 'char', keyCode: msg })
            contents.sendInputEvent({ type: 'keyUp', keyCode: msg })
        })

        contents.on('new-window', function (newWindowEvent, url) {
            newWindowEvent.preventDefault()
            urlCheck(url)
        })
        contents.on('will-navigate', function (newWindowEvent, url) {
            newWindowEvent.preventDefault()
            urlCheck(url)
        })
        contents.on('will-redirect', function (newWindowEvent, url) {
            newWindowEvent.preventDefault()
            urlCheck(url)
        })
    }
})

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault()
    callback(true)
})

app.on('window-all-closed', function () {
    app.quit()
})

// FUNCTIONS

function urlCheck(url) {
    if(updatedConfiguration.whitelist.find(i => url.includes(i))) {
        mainWindow.webContents.send('change-url', url)
    } else {
        let urlCheckError = new Alert()

        let swalOptions = {
            text: "Доступ запрещен",
            type: 'error',
        }

        let promise = urlCheckError.fireWithFrame(swalOptions, "Error", null, false);
        promise.then((result) => {
            //
        })
    }
}

function functionButton(button) {
    let passwordAlert = new Alert()

    let swalOptions = {
        text: "Введите пароль",
        input: 'text',
        showCancelButton: true
    }

    let promise = passwordAlert.fireWithFrame(swalOptions, "Введите пароль", null, false);
    promise.then((result) => {
        if (result.value && result.value == '12345678') {
            if(button == 'F1') {
                app.exit(0)
            }
            if(button == 'F2') {
                execute('taskmgr', (output) => {})
            }
            if(button == 'F3') {
                mainWindow.webContents.send('change-url', 'http://127.0.0.1:3000')
            }
        } else if (result.dismiss === Alert.DismissReason.cancel) {
            // canceled
        }
    })
}

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout)
    })
}