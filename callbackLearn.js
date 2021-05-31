const util = require('util');
const sqlite3 = require('sqlite3').verbose();
const path=require('path')
let db = new sqlite3.Database('./test.db', (err) => {
    if (err) console.error('error with database ', err);
});



async function getData() {
    return await util.promisify(db.get.bind(db))('select * from TYPE');
}

async function play() {
    var a;
    a = await getData();
    console.log(a);
}

// play();
console.log(path.join(__dirname,"test.db"))
