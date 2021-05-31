//data description
// product id
// productName
// company
// type
// buyingPrice
// sellingPrice
// buying date
// quantity
//
//

const initColumns = [
    {
        field: 'wareHouseId',
        type: 'number',
        align: 'center',
    },
    {
        field: 'productName',
    },
    {
        field: 'company',
    },
    {
        field: 'type',
    },
    {
        field: 'sellingPrice',
        type: 'number',
        width: 170,
        align: 'center',
    },
    {
        field: 'buyingPrice',
        type: 'number',
        width: 170,
        align: 'center',
    },
    {
        field: 'date',
        type: 'date',
    },
    {
        field: 'quantity',
        type: 'number',
    },
];
export default initColumns;

// const initRows = [
//     {
//         id: 1,
//         productId: 1,
//         quantity: 2,
//         productName: 'كنزة',
//         company: 'اديداس',
//         type: 'أطفال',
//         buyingPrice: 232,
//         sellingPrice: 300,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 2,
//         productId: 2,
//         quantity: 56,
//         productName: 'بنطرون',
//         company: 'نايك',
//         type: 'رجالي',
//         buyingPrice: 100,
//         sellingPrice: 400,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 3,
//         productName: 'بوط',
//         productId: 3,
//         quantity: 34,
//         company: 'محلات جواهر',
//         type: 'نسائي',
//         buyingPrice: 32,
//         sellingPrice: 50,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 4,
//         productId: 3,
//         productName: 'قميص',
//         quantity: 33,
//         company: 'الشركة القابصة',
//         type: 'رجالي',
//         buyingPrice: 100,
//         sellingPrice: 560,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 5,
//         productId: 4,

//         productName: 'حزام',
//         quantity: 22,
//         company: 'مصنع الجلود',
//         type: 'أطفال',
//         buyingPrice: 232,
//         sellingPrice: 300,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 6,
//         productName: 'كنزة',
//         productId: 5,
//         quantity: 45,
//         company: 'اديداس',
//         type: 'أطفال',
//         buyingPrice: 232,
//         sellingPrice: 300,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 7,
//         productId: 7,
//         quantity: 12,
//         productName: 'بنطرون',
//         company: 'نايك',
//         type: 'رجالي',
//         buyingPrice: 100,
//         sellingPrice: 400,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 8,
//         quantity: 4,
//         productId: 8,
//         productName: 'بوط',
//         company: 'محلات جواهر',
//         type: 'نسائي',
//         buyingPrice: 32,
//         sellingPrice: 50,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 9,
//         quantity: 15,
//         productId: 9,
//         productName: 'قميص',
//         company: 'الشركة القابصة',
//         type: 'رجالي',
//         buyingPrice: 100,
//         sellingPrice: 560,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
//     {
//         id: 10,
//         quantity: 66,
//         productId: 10,
//         productName: 'حزام',
//         company: 'مصنع الجلود',
//         type: 'أطفال',
//         buyingPrice: 232,
//         sellingPrice: 300,
//         date: moment('01/12/2016', 'DD/MM/YYYY').format('DD/MM/YYYY'),
//     },
// ];
