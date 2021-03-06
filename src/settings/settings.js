const fs = require(`fs`);
const path = require(`path`);
const {app, dialog} = require(`electron`).remote;

const [
  elSettings,
  elUrl,
  elId,
  elFullscreen,
  elDone
] = document.querySelectorAll(`#settings, #url, #id, #fullscreen, #done`);

const settings = {};

elSettings.addEventListener(`submit`, ()=> {
  settings.url = elUrl.value;
  settings.id = elId.value.trim();
  settings.fullscreen = elFullscreen.checked;

  const dir = path.dirname(app.getPath(`exe`));

  fs.writeFile(
    path.join(dir, `webtrapp.txt`),

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
