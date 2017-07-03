// WebTrapp, by Brian Blakely.

const fs = require(`fs`);
const path = require(`path`);
const url = require(`url`);
const {app, BrowserWindow, dialog} = require(`electron`);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  const settings = {
    url: ``,
    id: ``,
    fullscreen: false
  };

  let page = url.format({
    pathname: path.join(__dirname, `settings`, `settings.html`),
    protocol: `file:`,
    slashes: true
  });

  const dir = path.dirname(app.getPath(`exe`));

  fs.readFile(
    path.join(dir, `webtrapp.txt`),

    (err, data)=> {
      if(!err) {
        Object.assign(settings, JSON.parse(data));

        page = url.format({
          pathname: path.join(__dirname, `index`, `index.html`),
          protocol: `file:`,
          slashes: true
        });
      }

      // Create the browser window.
      win = new BrowserWindow({
        icon: path.join(__dirname, `icons/png/64x64.png`),
        fullscreen: settings.fullscreen
      });
      win.setMenu(null);
      win.settings = settings;
      // win.webContents.openDevTools();

      // and load the index.html of the app.
      win.loadURL(page);

      // Emitted when the window is closed.
      win.on(`closed`, () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
      });
    }
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(`ready`, createWindow);

// Quit when all windows are closed.
app.on(`window-all-closed`, () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if(process.platform !== `darwin`) {
    app.quit();
  }
});

app.on(`activate`, () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if(win === null) {
    createWindow();
  }
});
