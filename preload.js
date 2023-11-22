const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api',{
    title:'DEXEL - Formations personnel',
    createNote: (data)=> ipcRenderer.invoke('create-file',data)
})