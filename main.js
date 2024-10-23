const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      session: require('electron').session.defaultSession
    }
  });

  // Capture les requêtes et modifie les headers pour simuler un navigateur classique
  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    // details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Sauvegarde les cookies de session pour éviter de passer le captcha à chaque fois
  session.defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
    if (!removed) {
      console.log('Cookie ajouté/activé : ', cookie);
    }
  });

  win.loadURL('https://chat.openai.com');
}

// app.disableHardwareAcceleration();
// app.commandLine.appendSwitch('use-angle', 'gl');
// app.commandLine.appendSwitch('use-gl', 'swiftshader');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.whenReady().then(createWindow);
