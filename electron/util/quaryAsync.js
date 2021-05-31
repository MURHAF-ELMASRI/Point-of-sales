exports.insertAsync = async (db, table, args) => {
    const keys = Object.keys(args)
        .map((e) => e)
        .join(',');
    const values = Object.keys(args).map((e) => args[e]);
    const placeHolder = values.map((e) => '?').join(',');
    console.log({ values, placeHolder, keys });
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO ${table}(${keys}) VALUES (${placeHolder})`,
            values,
            function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            }
        );
    });
};
//to run update and get quaries
exports.whereAsync = async (db, quary, args) => {
    let values = [];
    let where = '';
    if (args) {
        values = Object.keys(args).map((e) => args[e]);
        where =
            'where ' +
            Object.keys(args).map((e) => {
                return e + '= ? ';
            });
    }
    return new Promise((resolve, reject) => {
        db.get(`${quary} ${where}`, values, function (err, rows) {
            if (err) return reject(err);
            resolve(true);
        });
    });
};
