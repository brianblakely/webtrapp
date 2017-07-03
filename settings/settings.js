const fs = require(`fs`);
const path = require(`path`);
const {app, dialog} = require(`electron`).remote;

const [
  elSettings,
  elUrl,
  elFullscreen,
  elDone
] = document.querySelectorAll(`#settings, #url, #fullscreen, #done`);

const settings = {};

elSettings.addEventListener(`submit`, ()=> {
  settings.url = elUrl.value;
  settings.fullscreen = elFullscreen.checked;

  const loc = app.getPath(`exe`);
  const dir = path.dirname(app.getPath(`exe`));
  const file = path.basename(loc).replace(path.extname(loc), ``);
  const configName = file === `webtrapp` ? file : `webtrapp_${file}`;

  fs.writeFile(
    path.join(dir, `${configName}.txt`),

    JSON.stringify(settings),

    (err) => {
      if(err) {
        dialog.showErrorBox(`Couldn't save your settings! Please report this:`, err);
        throw err;
      }

      app.relaunch();
      app.exit();
    }
  );
});
