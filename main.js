// main.js 
// ChatGPT Electron 
// by Andaroth 
// https://github.com/Andaroth/chatgpt-electron
const { Menu, app, BrowserWindow, session } = require('electron');
const prompt = require('electron-prompt');

const fs = require('fs');
const path = require('path');

let win;

function getSessions() {
  const sessionFile = path.join(__dirname, `sessions.json`);
  if (fs.existsSync(sessionFile)) {
    const sessions = JSON.parse(fs.readFileSync(sessionFile))
    return sessions || {}
  } else return null
}

function getSessionsNames() {
  return Object.keys(getSessions() || {}) || []
}

function removeSession(name, session) {
  const mutableSession = getSessions() || {};
  if (mutableSession[name]) {
    delete mutableSession[name];
    const sessionFile = path.join(__dirname, `sessions.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(mutableSession));
    setTimeout(() => win.reload(), 1000);
  }
}

function storeSession(name, session) {
  console.log('storeSession')
  if (Object.keys(session).length) {
    const mutableSession = getSessions() || {};
    session.cookies.get({}).then((cookies) => {
      console.log('store, cookies', cookies);
      mutableSession[name] = { cookies };
      const sessionFile = path.join(__dirname, `sessions.json`);
      fs.writeFileSync(sessionFile, JSON.stringify(mutableSession));
    });
  }
}

function loadSession(name, session) {
  console.log('loadSession')
  const existingSessions = getSessions();
  const cookies = existingSessions[name]?.cookies || [];
  const sessionFile = path.join(__dirname, `sessions.json`);
  if (fs.existsSync(sessionFile)) {
    session.clearStorageData();
    cookies.forEach((cookie) => {
      console.log('load, cookie', cookie);
      const url = `https://${cookie.domain.replace(/^\./, '')}`;
      if (cookie.name.startsWith('__Secure-')) cookie.secure = true;  // flag safe
      if (cookie.name.startsWith('__Host-')) {
        cookie.secure = true;  // flag safe
        cookie.path = '/';     // set root path
        delete cookie.domain;  // delete, refer to url
        delete cookie.sameSite; // allow cookies from third auth
    }
      session.cookies.set({
        url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: cookie.expirationDate
      }).then(() => {
        console.log(`${url} cookie ${cookie.name} restored`);
      }).catch((error) => {
        console.error('Error while opening cookie :', error);
      });
    });
    win.reload();
  }
}

function generateMenu() {{
  console.log('generateMenu')
  const sessionMenuTemplate = [
    {
      label: 'Sessions',
      submenu: [...getSessionsNames().map((name) => ({
        label: name,
        click() {
          loadSession(name, session.defaultSession);
        }
      })), 
      {
        type: "separator"
      },
      {
        label: "Save Current Session",
        click: async () => {
          const ask = () => {
            prompt({
              title: 'Saving Current Session',
              label: 'Please chose a name:',
              inputAttrs: {
                  type: 'text'
              },
              type: 'input'
            }).then((text) => {
                if (text === "") ask();
                else if (text !== null) {
                  storeSession(text, session.defaultSession)
                  setTimeout(() => loadSession(text, session.defaultSession))
                }
            }).catch(console.error);
          }
          ask()
        }
      },
      {
        label: "Delete A Session",
        click: async () => {
          const ask = () => {
            prompt({
              title: 'Delete A Session',
              label: 'Enter the EXACT NAME to remove:',
              inputAttrs: {
                  type: 'text'
              },
              type: 'input'
            }).then((text) => {
                if (text === "") ask();
                else if (text !== null) removeSession(text, session.defaultSession)
            }).catch(console.error);
          }
          ask()
        }
      }
    ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(sessionMenuTemplate);
  Menu.setApplicationMenu(menu);
}}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true,
      webSecurity: false,
      session: require('electron').session.defaultSession
    }
  });

  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  generateMenu();

  win.webContents.on('did-finish-load', () => generateMenu());
}

app.commandLine.appendSwitch('disable-software-rasterizer');

app.whenReady().then(createWindow);
