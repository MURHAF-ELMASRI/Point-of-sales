const { ipcMain } = require('electron');
const { insertAsync } = require('../util/quaryAsync');

module.exports = function (win, db) {
    ipcMain.on('create-product', async (e, data) => {
        
        var typeId = data.typeId,
            companyId = data.companyId,
            productId;
        try {
            if (data.productId) {
                win.webContents.send('show-error', {
                    ok: false,
                    msg: `${data.productName} product existed`,
                });
                return;
            }
            if (!data.productName) throw new Error('Prouduct Name missing');

            if (!typeId)
                typeId = await insertAsync(db, 'type', { name: data.type });
           
            if (!companyId)
                companyId = await insertAsync(db, 'company', {
                    name: data.company,
                });
        

            productId = await insertAsync(db, 'PRODUCTS', {
                name: data.productName,
                companyId,
                typeId,
            });

            win.webContents.send('create-product', {
                ok: true,
                msg: '',
                data: {
                    ...data,
                    productId,
                    typeId,
                    companyId,
                },
            });
        } catch (e) {
            win.webContents.send('show-error', {
                ok: false,
                msg: e.message,
                data: '',
            });
        }
    });
};
