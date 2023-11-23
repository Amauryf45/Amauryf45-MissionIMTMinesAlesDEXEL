const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api',{
    title:'DEXEL - Formations personnel',
    createNote: (data)=> ipcRenderer.invoke('create-file',data),
    checkEmployee: (filter)=> ipcRenderer.invoke('employeData',filter),
    openPersonnePopUp: (data)=> ipcRenderer.invoke('openPersonnePopUp',data),
    updatePersonne: (personneData) => ipcRenderer.invoke('updatePersonne',personneData),
})