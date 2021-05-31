const { ipcMain } = require('electron');
const { whereAsync } = require('../util/quaryAsync');
module.exports = function (win, db) {
    ipcMain.on('delete-data', async (e, data) => {
        try {
            console.log(data);
            data.ids.forEach(async (e) => {
                await whereAsync(db, `DELETE FROM ${data.table}`, {
                    [data.key]: e,
                });
            });
            win.webContents.send('delete-data', {
                msg: 'data deleted',
                ok: true,
                data: data.ids,
            });
        } catch (e) {
            win.webContents.send('show-error', {
                msg: e.message,
                ok: false,
                data: '',
            });
        }
    });
};
