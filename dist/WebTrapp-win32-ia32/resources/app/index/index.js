const win = require(`electron`).remote.getCurrentWindow();
const webview = document.querySelector(`webview`);

webview.src = win.settings.url;
if(win.settings.id) {
  webview.partition = `persist:${win.settings.id}`;
}

win.on(`app-command`, (e, cmd) => {
  // Navigate the window when the user hits their back/forward button.
  if(cmd === `browser-backward` && webview.canGoBack()) {
    webview.goBack();
  } else if(cmd === `browser-forward` && webview.canGoForward()) {
    webview.goForward();
  }
});

// Continuously repaint app, for the benefit of shims like the Steam Overlay.
const canvas = document.querySelector(`canvas`);
const repainter = canvas.getContext(`2d`);

const paint = ()=> {
  repainter.clearRect(0,0,1,1);

  this.requestAnimationFrame(paint);
};

this.requestAnimationFrame(paint);
