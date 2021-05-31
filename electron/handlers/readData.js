const { ipcMain } = require('electron');

const quary = {
    products: `select  p.productId,p.name as productName,t.name as type,c.name as company,c.companyId,t.typeId from products p inner JOIN COMPANY c on c.companyId=p.companyId
inner JOIN type t on t.typeId=p.typeId;`,

    wareHouse: `select w.wareHouseId,w.productId,p.productName,w.quantity,w.sellingPrice,w.buyingPrice,p.company,p.type,w.date	 from WAREHOUSE w 
inner join (select  p.productId,p.name as productName,t.name as type,c.name as company,c.companyId,t.typeId from products p inner JOIN COMPANY c on c.companyId=p.companyId
inner JOIN type t on t.typeId=p.typeId) as p on p.productId=w.productId;
`,

    sales: `SELECT s.saleId,w.wareHouseId,w.productName,c.name as customer,w.buyingPrice,w.sellingPrice ,s.date,w.company,w.type
				from SALES s
				INNER JOIN
				(select w.wareHouseId,w.productId,p.productName,w.quantity,w.sellingPrice,w.buyingPrice,p.company,p.type,w.date	 from WAREHOUSE w 
				inner join (select  p.productId,p.name as productName,t.name as type,c.name as company,c.companyId,t.typeId from products p inner JOIN COMPANY c on c.companyId=p.companyId
				inner JOIN type t on t.typeId=p.typeId) as p on p.productId=w.productId) 
                w on w.wareHouseId=s.wareHouseId
                LEFT JOIN CUSTOMER c on s.customerId=c.customerId;
			`,
};

const tables = ['sales', 'wareHouse', 'products'];

//TODO: repleace it with async where
module.exports = function (win, db) {
    ipcMain.on('read-data', (e, table) => {
        console.log('request table from ', table);
        if (tables.includes(table)) {
            db.all(quary[table], [], (err, rows) => {
                if (err) {
                    win.webContents.send('show-error', {
                        ok: false,
                        data: '',
                        msg: err.message,
                    });
                    return;
                }
                win.webContents.send(`send-${table}`, {
                    ok: true,
                    data: rows,
                    msg: '',
                });
            });
        }
    });
};
