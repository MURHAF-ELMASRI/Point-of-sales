const { ipcRenderer, contextBridge } = require('electron');
//white list channel
const whiteList = [
    'read-data',
    'create-wareHouse',
    'create-product',
    'create-sale',
    'show-error',
    'delete-data'
];

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        console.log('sending to ', channel);
        if (whiteList.includes(channel)) {
            ipcRenderer.send(channel, data);
        } else {
            console.log('error in preload');
        }
    },
    listen: (channel, func) => {
        ipcRenderer.on(channel, (event, data) => {
            console.log(channel, '  ', data);
            func(event, data);
        });
    },
    remove: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    },
});
