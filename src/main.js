const { app, BrowserWindow, Menu, shell } = require('electron')
const githubLink = require('../package.json')
const { join } = require('path')
const fs = require('fs')
const rpgFiles = join(app.getPath('userData'), '/Local Storage/rpgs')

function createWindow() {
  // Create the browser window
  const win = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Loads the index.html file
  win.loadFile(join(__dirname, 'index.html'))

  // Open the DevTools
  // win.webContents.openDevTools()

  // Handles the program's menu bar
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Import RPG',
          click() {
            shell.openPath(rpgFiles)
          }
        },
        { role: 'quit'}
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Toggle DevTools',
          role: 'toggleDevTools'
        },
        {
          label: 'About',
          click() {
            shell.openExternal(githubLink.homepage)
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // Adds files in rpgs folder to select element
  win.webContents.once('dom-ready', () => {
    win.webContents.executeJavaScript(`
    if (!fs.existsSync(rpgFiles)) {
      fs.mkdirSync(rpgFiles)
      fs.copyFileSync((join(__dirname, 'example-rpgs/example-one.json')), rpgFiles + '/example-one.json')
      fs.copyFileSync((join(__dirname, 'example-rpgs/example-two.json')), rpgFiles + '/example-two.json')
      fs.readdir(rpgFiles, (err, files) => {
        if (err) return console.error(err)
        files.forEach(file => { 
          if (!file.endsWith('.json')) return
          let rpgName = file.split('.')[0]
          const rpgSelect = document.getElementById("rpg-select")
          let newOption = document.createElement("option")
          newOption.text = rpgName
          rpgSelect.add(newOption)
          console.log(rpgName + " file loaded")
        })
      })
    } else {
      fs.readdir(rpgFiles, (err, files) => {
        if (err) return console.error(err)
        files.forEach(file => { 
          if (!file.endsWith('.json')) return
          let rpgName = file.split('.')[0]
          const rpgSelect = document.getElementById("rpg-select")
          let newOption = document.createElement("option")
          newOption.text = rpgName
          rpgSelect.add(newOption)
          console.log(rpgName + " file loaded")
        })
      })
    }
    `)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.