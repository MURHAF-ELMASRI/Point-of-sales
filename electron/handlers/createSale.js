const { ipcMain } = require('electron');
const { insertAsync, whereAsync } = require('../util/quaryAsync');
module.exports = function (win, db) {
    ipcMain.on('create-sale', async (e, data) => {
        try {
            var customerId, saleId;
            console.log('createSale.js 7', data);
            //1- update quantity
            await whereAsync(
                db,
                `UPDATE wareHouse set quantity=${data.quantity - 1}`,
                {
                    wareHouseId: data.wareHouseId,
                }
            );
            //2 - sent customer name
            if (data.customer) {
                var customer = await whereAsync(
                    db,
                    'select customerId from customer ',
                    {
                        name: data.customer,
                    }
                );

                if (!customer)
                    customerId = await insertAsync(db, 'customer', {
                        name: data.customer,
                    });
            }
            //3 - insert the rest of the data
            saleId = await insertAsync(db, 'sales', {
                date: data.date,
                customerId: customerId,
                wareHouseId: data.wareHouseId,
            });

            const { quantity, ...temp } = data;
            win.webContents.send('create-sale', {
                ok: true,
                msg: '',
                data: { ...temp, saleId },
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
