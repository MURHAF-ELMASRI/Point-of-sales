const { app, BrowserWindow, Menu, nativeImage } = require('electron');
const configerDatabse = require('./util/configerDatabase');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const isDev = require('electron-is-dev');
const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

const {
    readData,
    createProduct,
    createWareHouse,
    createSale,
    deleteData,
} = require('./handlers');

const icon = nativeImage.createFromPath(
    path.join(__dirname, 'electron/up-arrow.png')
);

/**
 * @type {BrowserWindow}
 */
let win;
/**
 * @type {new sqlite3.Database('./hello')}
 */
console.log(app.getPath('userData'));
let db = new sqlite3.Database(
    path.join(app.getPath('userData'), 'test.db'),
    (err) => {
        if (err) console.error('error with database ', err);
        else {
        }
    }
);

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 520,
        icon,
        webPreferences: {
            preload: path.join(__dirname, 'preload', 'preload.js'),
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:3000/index.html');
    } else {
        // 'build/index.html'
        win.loadURL(`file://${__dirname}/../build/index.html`);
    }
    // crud handler

    configerDatabse(db);
    readData(win, db);
    createProduct(win, db);
    createWareHouse(win, db);
    createSale(win, db);
    deleteData(win, db);
    win.on('closed', () => (win = null));

    // Hot Reloading
    // if (isDev) {
    //     // 'node_modules/.bin/electronPath'
    //     try {
    //         require('electron-reloader')(module);
    //     } catch (_) {}
    // }

    // DevTools

    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
//-----------------------create Menu------------------------//
const template = [
    {
        label: 'FILE',
        submenu: [{ role: 'quit' }, { role: 'reload' }],
    },
    {
        label: 'edit',
        submenu: [
            { role: 'copy' },
            { role: 'cut' },
            { role: 'paste' },
        ],
    },
    {
        label: 'help',
        submenu: [
            {
                label: 'Speak with me',
                click: (menuItem, browserWindow, event) => {
                    var bv = new BrowserWindow({ icon });
                    bv.webContents.loadURL('https://wa.me/095377994261');
                    bv.setMenu(null);
                    bv.on('closed', () => {
                        bv = null;
                    });
                },
            },
        ],
    },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

//-----------------------End Menu------------------------//

//TODO : handle update data

//TODO : delete the data

//---------------- listen requste data ----------------//
/**
 *
 * @param {db} database
 * @param {string} quary
 * @param {Object} keyValue
 */
