const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api',{
    title:'DEXEL - Formations personnel',
    createNote: (data)=> ipcRenderer.invoke('create-file',data),
    checkEmployee: (filter)=> ipcRenderer.invoke('employeData',filter),
    openPersonnePopUp: (data)=> ipcRenderer.invoke('openPersonnePopUp',data),
    updatePersonne: (personneData) => ipcRenderer.invoke('updatePersonne',personneData),
    removePersonne: (personneID) => ipcRenderer.invoke('removePersonne',personneID),
    getFormationsPersonne: (personneID)=> ipcRenderer.invoke('getFormationsPersonne',personneID),
    getFormationInfo: (formationID)=> ipcRenderer.invoke('getFormationInfo',formationID),
    getPosteInfo: (posteID)=> ipcRenderer.invoke('getPosteInfo',posteID),
    getCompetenceInfo: (competenceID)=> ipcRenderer.invoke('getCompetenceInfo',competenceID),
    getPersonneCompetence: (personneID,competenceID)=> ipcRenderer.invoke('getPersonneCompetence',{personneID,competenceID}),
    updateValidFormation: (value,personneID,competenceID)=> ipcRenderer.invoke("updateValidFormation",{value,personneID,competenceID}),
    closeCurrentWindow : ()=>ipcRenderer.invoke('closeCurrentWindow'),
})