const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { windowsStore } = require('process');
const path = require("path");
const fs = require("fs");
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
    ignored: /src\/data|[/\\]\./,
});

const XLSX = require("xlsx");
let file = path.join(__dirname, "src/data/dataFormation2.xlsx");

function createWindow() {
    const mainWindow = new BrowserWindow({
        height: 720,
        width: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Menu.setApplicationMenu(null);

    mainWindow.maximize();

    ipcMain.handle('employeData', (req, filter) => {

        let listeEmployee = getEmployee(filter);

        return { listeEmployee }
    })

    ipcMain.handle('openPersonnePopUp', (req, data) => {
        let popUpWindow = new BrowserWindow({
            // options de la fenêtre, par exemple, fullscreen, etc.
            modal: true,
            parent: mainWindow,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        });
        popUpWindow.loadFile(`src/production/fichePersonnel.html`).then(() => {
            console.log("do then");
            popUpWindow.webContents.executeJavaScript(`updatePersData({ID_Personne: '${data.ID_Personne}', Genre: '${data.Genre ? data.Genre.replace(/(?<!\\)'/g, "\\'") : ''}', Nom: '${data.Nom ? data.Nom.replace(/(?<!\\)'/g, "\\'") : ''}', Prenom: '${data.Prenom ? data.Prenom.replace(/(?<!\\)'/g, "\\'") : ''}', Info: '${data.Info ? data.Info.replace(/(?<!\\)'/g, "\\'") : ''}'})`);
        }).catch(error => {
            console.error('Erreur lors de l’exécution du script openPersonnePopUp :', error);
        });
        popUpWindow.on('closed', () => {
            mainWindow.webContents.executeJavaScript(`closePersonnePopUp()`);
        });
    })

    ipcMain.handle('closeCurrentWindow', req => {
        const window = BrowserWindow.fromWebContents(req.sender);
        if (window) window.close();
    })


    ipcMain.handle('updatePersonne', (req, data) => {
        updateEmployee(data);
    })

    ipcMain.handle('removePersonne', (req, personneID) => {
        removePersonne(personneID);
    })

    ipcMain.handle('getPersonneInfo', (req, personneID) => {

        let infoPersonne = getPersonneInfo(personneID);

        return { infoPersonne }
    })


    ipcMain.handle('getFormationsPersonne', (req, personneID) => {

        let listeFormations = getFormationsPersonne(personneID);

        return { listeFormations }
    })

    ipcMain.handle('getFormationsPersonneByID', (req, ID) => {

        let formation = getFormationsPersonneByID(ID);

        return { formation }
    })

    ipcMain.handle('addCompToForm', (req, { compID, formationID }) => {

        addCompToForm(compID, formationID);
    })

    ipcMain.handle('getFormationID', (req, { posteID, posteType }) => {

        let formationID = getFormationID(posteID, posteType);

        return { formationID }
    })

    ipcMain.handle('getFormationInfo', (req, formationID) => {

        let infoFormation = getFormationInfo(formationID);

        return { infoFormation }
    })

    ipcMain.handle('updateFormationCompOrder', (req, { formationID, index, upOrDown }) => {

        updateFormationCompOrder(formationID, index, upOrDown);
    })

    ipcMain.handle('createFormation', (req, { posteID, posteType }) => {

        createFormation(posteID, posteType);

    })

    ipcMain.handle('openPostePopUp', (req, data) => {
        let popUpWindow = new BrowserWindow({
            // options de la fenêtre, par exemple, fullscreen, etc.
            modal: true,
            parent: mainWindow,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        });
        popUpWindow.loadFile(`src/production/fichePoste.html`).then(() => {
            console.log("do then");
            popUpWindow.webContents.executeJavaScript(`updatePosteData({ID_Poste: '${data.ID_Poste}',NomPoste: '${data.NomPoste ? data.NomPoste.replace(/(?<!\\)'/g, "\\'") : ''}', Categorie: '${data.Categorie ? data.Categorie.replace(/(?<!\\)'/g, "\\'") : ''}', InfoPoste: '${data.InfoPoste ? data.InfoPoste.replace(/(?<!\\)'/g, "\\'") : ''}'})`);
        }).catch(error => {
            console.error('Erreur lors de l’exécution du script openPostePopUp :', error);
        });
        popUpWindow.on('closed', () => {
            mainWindow.webContents.executeJavaScript(`closePostePopUp()`);
        });
    })

    ipcMain.handle('removePoste', (req, posteID) => {
        removePoste(posteID);
    })

    ipcMain.handle('updatePoste', (req, data) => {
        updatePoste(data);
    })


    ipcMain.handle("getAllPostes", (req,filter) => {
        let allPostes = getAllPostes(filter);

        return { allPostes };
    })

    ipcMain.handle('getPosteInfo', (req, posteID) => {

        let infoPoste = getPosteInfo(posteID);

        return { infoPoste }
    })

    ipcMain.handle('getFormationsPoste', (req, posteID) => {

        let listeFormations = getFormationsPoste(posteID);

        return { listeFormations }
    })

    ipcMain.handle("getAllCompetences", (req) => {
        let allCompetences = getAllCompetences();

        return { allCompetences };
    })

    ipcMain.handle('getCompetenceInfo', (req, competenceID) => {

        let infoCompetence = getCompetenceInfo(competenceID);

        return { infoCompetence }
    })

    ipcMain.handle('createCompetence', (req, { nomComp, unique }) => {

        let newCompetence = createCompetence(nomComp, unique);

        return { newCompetence }
    })

    ipcMain.handle('updatePersonneCompetence', (req, compInfo) => {

        updatePersonneCompetence(compInfo);

    })


    ipcMain.handle('getPersonneCompetence', (req, { personneID, posteID, competenceID }) => {

        let infoPersComp = getPersonneCompetence(personneID, posteID, competenceID);

        return { infoPersComp }
    })

    ipcMain.handle("getPersonneFormationLastIndex", (req) => {
        let lastIndex = getPersonneFormationLastIndex();

        return { lastIndex };
    })


    ipcMain.handle('updateValidFormation', (req, { value, personneID, competenceID }) => {

        updateValidFormation(value, personneID, competenceID);
    })

    ipcMain.handle('updateFormationPersonnes', (req, { persFormID, newValue }) => {
        updateFormationPersonnes(persFormID, newValue);
    })

    ipcMain.handle('removeFormationPersonne', (req, { formationID, personneID }) => {
        removeFormationPersonne(formationID, personneID);
    })

    mainWindow.loadFile('src/accueil.html')
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})



function getEmployee(filter) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    let filteredEmployes = sheetPersonnes.filter(personne => (comparerChaines(filter, personne.Genre) || comparerChaines(filter, personne.Prenom) || comparerChaines(filter, personne.Nom)));

    return filteredEmployes
}

function updateEmployee(personne) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    // Trouver et mettre à jour l'employé
    let foundIndex = sheetPersonnes.findIndex(p => p.ID_Personne == personne.ID_Personne);
    if (foundIndex !== -1) {
        sheetPersonnes[foundIndex] = { ...sheetPersonnes[foundIndex], ...personne };
    }
    else {
        sheetPersonnes[personne.ID_Personne] = { ...sheetPersonnes[personne.ID_Personne], ...personne };
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnes);
    workbook.Sheets['Personnes'] = newSheet;
    XLSX.writeFile(workbook, file);
}

function removePersonne(personneID) {
    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    // Supprimer l'employé
    sheetPersonnes = sheetPersonnes.filter(personne => personne.ID_Personne != personneID);

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnes);
    workbook.Sheets['Personnes'] = newSheet;
    XLSX.writeFile(workbook, file);
}

function getPersonneInfo(personneID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    let personneInfos = sheetPersonnes.find(personne => personneID == personne.ID_Personne);

    return personneInfos
}

function getFormationsPersonne(personneID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonneFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    let filteredFormations = sheetPersonneFormations.filter(formation => personneID == formation.ID_Personne);

    return filteredFormations
}


function getFormationsPersonneByID(ID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonneFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    let filteredFormations = sheetPersonneFormations.find(formation => ID == formation.ID_PersonneFormation);

    return filteredFormations
}

function getPersonneFormationLastIndex() {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonneFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    let lastIndex = sheetPersonneFormations.pop().ID_PersonneFormation;


    return lastIndex
}

function getFormationID(posteID, posteType) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);

    let formationInfo = sheetFormations.find(formation => (posteID == formation.ID_Poste && posteType == formation.TypeFormation));

    return formationInfo ? formationInfo.ID_Formation : (-1);
}

function getFormationInfo(formationID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);

    let formationInfo = sheetFormations.find(formation => formationID == formation.ID_Formation);

    return formationInfo
}

function updateFormationCompOrder(formationID, index, upOrDown) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);

    let formationIndex = sheetFormations.findIndex(formation => formationID == formation.ID_Formation);

    if (formationIndex !== -1) {
        let listeCompetence = sheetFormations[formationIndex].Competences.split(";");
        if (upOrDown=="up") {
            let temp = listeCompetence[index]
            listeCompetence[index] = listeCompetence[index - 1];
            listeCompetence[index - 1] = temp;
        }
        else if(upOrDown == "down") {
            let temp = listeCompetence[index]
            listeCompetence[index] = listeCompetence[index + 1];
            listeCompetence[index + 1] = temp;
        }
        else if (upOrDown == "supp"){
            listeCompetence.splice(index,1);
        }
        else{
            console.log("this case cannot happen")
        }

        sheetFormations[formationIndex].Competences = listeCompetence.join(";");
    }
    else {
        console.log("weird this is not supposed to happen bc the Formation exist")
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetFormations);
    workbook.Sheets['Formations'] = newSheet;
    XLSX.writeFile(workbook, file);

}



function createFormation(newPosteID, newPosteType) {

    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);

    let newFormationID = "" + ((+sheetFormations.at(-1).ID_Formation) + 1);

    // Ajouter une nouvelle formation
    let newFormation = { ID_Formation: newFormationID, ID_Poste: newPosteID, TypeFormation: newPosteType };
    sheetFormations.push(newFormation);

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetFormations);
    workbook.Sheets['Formations'] = newSheet;
    XLSX.writeFile(workbook, file);
}

function addCompToForm(compID, formationID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);

    let formationIndex = sheetFormations.findIndex(formation => formationID == formation.ID_Formation);

    if (formationIndex !== -1) {
        let competence = sheetFormations[formationIndex];
        let listeComp = competence.Competences;
        if (listeComp.split(";").includes(compID)) {
            console.log("compétence déjà présente")
        }
        else {
            competence.Competences = listeComp + ";" + compID;
            sheetFormations[formationIndex] = { ...sheetFormations[formationIndex], ...competence };
        }
    }
    else {
        console.log("not supposed to add a comp to a form that doesnt exist")
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetFormations);
    workbook.Sheets['Formations'] = newSheet;
    XLSX.writeFile(workbook, file);

}

function removePoste(posteID) {
    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPoste = XLSX.utils.sheet_to_json(workbook.Sheets['Postes']);

    // Supprimer l'employé
    sheetPoste = sheetPoste.filter(poste => poste.ID_Personne != posteID);

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPoste);
    workbook.Sheets['Postes'] = newSheet;
    XLSX.writeFile(workbook, file);
}


function updatePoste(poste) {

    console.log("update poste")

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPoste = XLSX.utils.sheet_to_json(workbook.Sheets['Postes']);

    // Trouver et mettre à jour l'employé
    let foundIndex = sheetPoste.findIndex(p => p.ID_Poste == poste.ID_Poste);
    if (foundIndex !== -1) {
        console.log("find index : "+foundIndex)
        sheetPoste[foundIndex] = { ...sheetPoste[foundIndex], ...poste };
    }
    else {
        sheetPoste[poste.ID_Poste] = { ...sheetPoste[poste.ID_Poste], ...poste };
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPoste);
    workbook.Sheets['Postes'] = newSheet;
    XLSX.writeFile(workbook, file);
}


function getAllPostes(filter) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPostes = XLSX.utils.sheet_to_json(workbook.Sheets['Postes']);

    let filteredPostes = sheetPostes.filter(poste => (comparerChaines(filter, poste.NomPoste) || comparerChaines(filter, poste.ID_Poste) || comparerChaines(filter, poste.Categorie)));


    return filteredPostes;
}

function getPosteInfo(posteID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPostes = XLSX.utils.sheet_to_json(workbook.Sheets['Postes']);

    let posteInfos = sheetPostes.find(poste => posteID == poste.ID_Poste);

    return posteInfos
}

function getFormationsPoste(posteID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);

    let filteredFormations = sheetFormations.filter(formation => posteID == formation.ID_Poste);



    // Extraire les données des feuilles
    let sheetPersonneFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    let filteredFormations2 = sheetPersonneFormations.filter(formation => filteredFormations.some(f_formation => f_formation.ID_Formation == formation.ID_Formation));

    return filteredFormations2
}

function getAllCompetences() {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetCompetences = XLSX.utils.sheet_to_json(workbook.Sheets['Competences']);

    return sheetCompetences;
}

function getCompetenceInfo(competenceID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetCompetences = XLSX.utils.sheet_to_json(workbook.Sheets['Competences']);

    let competenceInfos = sheetCompetences.find(competence => competenceID == competence.ID_Competence);

    return competenceInfos
}


function createCompetence(nomComp, unique) {

    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetCompetences = XLSX.utils.sheet_to_json(workbook.Sheets['Competences']);

    let newCompetenceID = "" + ((+sheetCompetences.at(-1).ID_Competence) + 1);

    // Ajouter une nouvelle formation
    let newCompetence = { ID_Competence: newCompetenceID, NomComp: nomComp, Unique: unique };
    sheetCompetences.push(newCompetence);

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetCompetences);
    workbook.Sheets['Competences'] = newSheet;
    XLSX.writeFile(workbook, file);

    return newCompetence;
}

function updatePersonneCompetence(compInfo) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonnesCompetences = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesCompetences']);
    console.log("id : "+ compInfo.ID_PersonneCompetence)
    let foundIndex = sheetPersonnesCompetences.findIndex(comp => compInfo.ID_PersonneCompetence == comp.ID_PersonneCompetence);
    
    if (foundIndex !== -1) {
        console.log("pas création nouvelle personne competences")

        sheetPersonnesCompetences[foundIndex] = { ...sheetPersonnesCompetences[foundIndex], ...compInfo };
    }
    else {
        console.log("création nouvelle personne competences")
        let newID = (+(sheetPersonnesCompetences.at(-1).ID_PersonneCompetence) + 1);
        console.log("newID : "+newID)
        compInfo.ID_PersonneCompetence = "" + newID;
        sheetPersonnesCompetences[newID+1] = { ...sheetPersonnesCompetences[newID+1], ...compInfo };
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnesCompetences);
    workbook.Sheets['PersonnesCompetences'] = newSheet;
    XLSX.writeFile(workbook, file);
}


function getPersonneCompetence(personneID, posteID, competenceID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonnesCompetences = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesCompetences']);

    let persCompInfos = sheetPersonnesCompetences.find(persComp => (competenceID==persComp.ID_Competence && (posteID == persComp.ID_Poste || "0"==persComp.ID_Poste) && personneID == persComp.ID_Personne));

    return persCompInfos
}


function updateValidFormation(value, personneID, competenceID) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonnesCompetences = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesCompetences']);

    let foundIndex = sheetPersonnesCompetences.findIndex(persComp => (competenceID == persComp.ID_Competence && personneID == persComp.ID_Personne));

    if (foundIndex !== -1) {
        let newValue = { ...sheetPersonnesCompetences[foundIndex] };
        newValue.Formation = value ? 1 : 0;

        sheetPersonnesCompetences[foundIndex] = { ...sheetPersonnesCompetences[foundIndex], ...newValue };
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnesCompetences);
    workbook.Sheets['PersonnesCompetences'] = newSheet;
    XLSX.writeFile(workbook, file);
}



function updateFormationPersonnes(persFormID, newValue) {

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPersonnesFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    // Trouver et mettre à jour 
    let foundIndex = sheetPersonnesFormations.findIndex(pf => pf.ID_PersonneFormation == persFormID);
    if (foundIndex !== -1) {
        console.log("pasNewF");
        sheetPersonnesFormations[foundIndex] = { ...sheetPersonnesFormations[foundIndex], ...newValue };
    }
    else { //newformation
        sheetPersonnesFormations[persFormID] = { ...sheetPersonnesFormations[persFormID], ...newValue };
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnesFormations);
    workbook.Sheets['PersonnesFormations'] = newSheet;
    XLSX.writeFile(workbook, file);
}


function removeFormationPersonne(formationID, personneID) {

    console.log("removeFormPers")
    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPersonnesFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    // Supprimer l'employé
    sheetPersonnesFormations = sheetPersonnesFormations.filter(formPers => !(formPers.ID_Personne == personneID && formPers.ID_PersonneFormation == formationID));

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnesFormations);
    workbook.Sheets['PersonnesFormations'] = newSheet;
    XLSX.writeFile(workbook, file);
}



// Fonction pour lire le fichier Excel et effectuer la recherche
function readAndSearchExcel() {
    console.log("try read excel");

    // Lire le fichier Excel
    var buffer = fs.readFileSync(file);
    var workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    var sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);
    var sheetFormations = XLSX.utils.sheet_to_json(workbook.Sheets['Formations']);
    var sheetPersonnesFormations = XLSX.utils.sheet_to_json(workbook.Sheets['PersonnesFormations']);

    // Trouver l'ID de Amaury Fumard
    var idAmaury = sheetPersonnes.find(p => p.Nom === 'FUMARD' && p.Prenom === 'Amaury').ID_Personne;

    // Filtrer pour les formations d'Amaury
    var formationsAmaury = sheetPersonnesFormations.filter(pf => pf.ID_Personne === idAmaury);

    // Obtenir les détails des formations
    var detailsFormations = formationsAmaury.map(f => sheetFormations.find(sf => sf.ID_Formation === f.ID_Formation));

    // Afficher les résultats
    console.log(detailsFormations);
}


function comparerChaines(chaine1, chaine2) {

    var chaine1 = Number.isInteger(chaine1) ? chaine1.toString() : chaine1;
    var chaine2 = Number.isInteger(chaine2) ? chaine2.toString() : chaine2;

    var chaine1 = chaine1 ? chaine1 : '';
    var chaine2 = chaine2 ? chaine2 : '';

    // Convertir les deux chaînes en minuscules (ou en majuscules)
    var chaine1Min = chaine1.toLowerCase();
    var chaine2Min = chaine2.toLowerCase();

    // Comparer les chaînes converties
    return chaine2Min.includes(chaine1Min);
}