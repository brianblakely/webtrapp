// WebTrapp, by Brian Blakely

const fs = require(`fs`);
const path = require(`path`);
const url = require(`url`);
const {app, BrowserWindow, dialog} = require(`electron`);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let repaint;

function createWindow() {
  let settings = {};

  const loc = app.getPath(`exe`);
  const dir = path.dirname(app.getPath(`exe`));
  const file = path.basename(loc).replace(path.extname(loc), ``);
  const configName = file === `webtrapp` ? file : `webtrapp_${file}`;

  fs.readFile(
    path.join(dir, `${configName}.txt`),

    (err, data)=> {
      if(err) {
        settings.url = url.format({
          pathname: path.join(__dirname, `settings.html`),
          protocol: `file:`,
          slashes: true
        });
        settings.fullscreen = false;
      } else {
        settings = JSON.parse(data);
      }

      // Create the browser window.
      win = new BrowserWindow({fullscreen: settings.fullscreen});
      win.setMenu(null);
      win.webContents.openDevTools();
      win.webContents.executeJavaScript(
        `
          window.__WebTrappRepainter__ = document.createElement('webtrapp-repainter');
          window.__WebTrappRepainter__.style.boxSizing = 'border-box !important';
          window.__WebTrappRepainter__.style.position = 'fixed !important';
          window.__WebTrappRepainter__.style.top = '0 !important';
          window.__WebTrappRepainter__.style.left = '0 !important';
          window.__WebTrappRepainter__.style.border = 'none !important';
          window.__WebTrappRepainter__.style.width = '100vw !important';
          window.__WebTrappRepainter__.style.height = '100vh !important';
          window.__WebTrappRepainter__.style.background = 'rgba(0,0,0,0) !important';
          window.__WebTrappRepainter__.style.boxShadow = 'none !important';
          window.__WebTrappRepainter__.style.pointerEvents = 'none !important';
          document.body.appendChild(window.__WebTrappRepainter__);
        `
      );
      repaint = setInterval(()=> {
        win.webContents.executeJavaScript(
          `window.__WebTrappRepainter__.style.background = 'rgba(255,255,${Math.random()*255|0},0)'`
          // `console.log(getComputedStyle(document.documentElement).backgroundColor)`
        );
      }, 16);

      // and load the index.html of the app.
      //win.loadURL(`http://www.youtube.com/`);
      win.loadURL(settings.url);

      // Emitted when the window is closed.
      win.on(`closed`, () => {
        clearInterval(repaint);
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
      });

      win.on(`app-command`, (e, cmd) => {
        // Navigate the window back when the user hits their mouse back button
        if(cmd === `browser-backward` && win.webContents.canGoBack()) {
          win.webContents.goBack();
        } else if(cmd === `browser-forward` && win.webContents.canGoForward()) {
          win.webContents.goForward();
        }
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
