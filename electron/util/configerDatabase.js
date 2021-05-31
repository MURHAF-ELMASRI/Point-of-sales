module.exports = function (db) {
    db.run(`CREATE TABLE IF NOT EXISTS "COMPANY" (
	"companyId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("companyId")
)`);
    db.run(`CREATE TABLE IF NOT EXISTS "CUSTOMER" (
	"customerId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("customerId")
)`);
    db.run(`CREATE TABLE IF NOT EXISTS "PRODUCTS" (
	"companyId"	INTEGER,
	"productId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"typeId"	INTEGER,
	FOREIGN KEY("typeId") REFERENCES "TYPE"("typeId") ON DELETE set NULL ON UPDATE set NULL,
	FOREIGN KEY("companyId") REFERENCES "COMPANY"("companyId") ON DELETE SET NULL ON UPDATE SET NULL,
	PRIMARY KEY("productId")
)`);
    db.run(`CREATE TABLE IF NOT EXISTS "SALES" (
	"customerId"	INTEGER,
	"date"	TEXT,
	"saleId"	INTEGER NOT NULL,
	"wareHouseId"	INTEGER NOT NULL,
	FOREIGN KEY("customerId") REFERENCES "CUSTOMER"("customerId") ON DELETE RESTRICT ON UPDATE RESTRICT,
	PRIMARY KEY("saleId")
)`);
    db.run(`CREATE TABLE IF NOT EXISTS "TYPE" (
	"typeId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("typeId")
)`);
    db.run(`CREATE TABLE IF NOT EXISTS "WAREHOUSE" (
	"buyingPrice"	INTEGER,
	"date"	INTEGER,
	"wareHouseId"	INTEGER NOT NULL,
	"productId"	INTEGER NOT NULL,
	"quantity"	INTEGER,
	"sellingPrice"	INTEGER,
	PRIMARY KEY("wareHouseId")
)`);
};
