const {app, BrowserWindow, ipcMain, powerSaveBlocker} = require('electron');
const storage = require('electron-json-storage');
const path = require('path');
const url = require('url');

let win;

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600});

  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools optionally:
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  });

  let powerSaverId;
  ipcMain.on('fullscreen', (event, arg) => {
    if (arg === true) {
      powerSaverId = powerSaveBlocker.start('prevent-display-sleep');
      // console.log(powerSaveBlocker.isStarted(powerSaverId));
    }
    else {
      powerSaveBlocker.stop(powerSaverId);
      // console.log(powerSaveBlocker.isStarted(powerSaverId));
    }
    win.setFullScreen(arg)
  });

  ipcMain.on('save', (event, arg) => {
    storage.set(arg.name, arg.data, (error) => {
      if(error)
        console.log(error);
      event.returnValue = '';
    })
  })

  ipcMain.on('remove', (event, arg) => {
    storage.remove(arg, (error) => {
      if(error)
        console.log(error);
      event.returnValue = '';
    })
  })

  ipcMain.on('get', (event, arg) => {
    storage.get(arg, (error, data) => {
      if(error)
        console.log(error);
      event.returnValue = data;
    })
  })

  ipcMain.on('getAll', (event) => {
    storage.keys((error, data) => {
      event.returnValue = data;
    })
  })

  // win.setMenu(null);
}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});
