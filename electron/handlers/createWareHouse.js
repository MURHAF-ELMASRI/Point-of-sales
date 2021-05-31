const { ipcMain } = require('electron');
const { insertAsync } = require('../util/quaryAsync');
module.exports = function (win, db) {
    ipcMain.on('create-wareHouse', async (e, data) => {
        
        try {
            //extract data from object
            const temp = (({
                productId,
                sellingPrice,
                buyingPrice,
                quantity,
                date,
            }) => ({ productId, sellingPrice, buyingPrice, quantity,date }))(data);

            const wareHouseId = await insertAsync(db, 'wareHouse', temp);

            
            win.webContents.send('create-wareHouse', {
                ok: true,
                msg: '',
                data: { ...data, wareHouseId },
            });
        } catch (err) {
            win.webContents.send('show-error', {
                ok: false,
                data: '',
                msg: err.message,
            });
        }
    });
};
