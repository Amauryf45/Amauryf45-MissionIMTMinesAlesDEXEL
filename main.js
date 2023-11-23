const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { windowsStore } = require('process');
const path = require("path");
const fs = require("fs");
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
    ignored: /__dirname\src\data\dataFormation.xlsx/ 

});

const XLSX = require("xlsx");


function createWindow() {
    const mainWindow = new BrowserWindow({
        height: 720,
        width: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //Menu.setApplicationMenu(null);

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

        // Charger l'URL ou le fichier HTML pour votre fenêtre
        //popUpWindow.loadFile(`src/production/fichePersonnel.html?genre=${data.Genre}&nom=${data.Nom}&prenom=${data.Prenom}`);
        popUpWindow.loadFile(`src/production/fichePersonnel.html`).then(() => {
            console.log("do then");
            popUpWindow.webContents.executeJavaScript(`updatePersData({ID_Personne: '${data.ID_Personne}',Genre: '${data.Genre}', Nom: '${data.Nom}', Prenom: '${data.Prenom}', Info: '${data.Info}'})`);
        }).catch(error => {
            console.error('Erreur lors de l’exécution du script :', error);
        });
    })

    ipcMain.handle('updatePersonne', (req,data)=>{
        updateEmployee(data);
    })

    mainWindow.loadFile('src/accueil.html')
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})



function getEmployee(filter) {
    let file = path.join(__dirname, "src/data/dataFormation.xlsx");

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    // Extraire les données des feuilles
    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    let filteredEmployes = sheetPersonnes.filter(personne => (comparerChaines(filter, personne.Genre) || comparerChaines(filter, personne.Prenom) || comparerChaines(filter, personne.Nom)));

    return filteredEmployes
}

function updateEmployee(personne) {
    console.log("update personne : "+personne)
    console.log("nom personne : "+personne.Nom)

    let file = path.join(__dirname, "src/data/dataFormation.xlsx");

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, { type: 'buffer' });

    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    // Trouver et mettre à jour l'employé
    let foundIndex = sheetPersonnes.findIndex(p => p.ID_Personne == personne.ID_Personne);
    if (foundIndex !== -1) {
        sheetPersonnes[foundIndex] = {...sheetPersonnes[foundIndex], ...personne};
    }

    // Convertir les données JSON en feuille de calcul et les écrire dans le fichier
    let newSheet = XLSX.utils.json_to_sheet(sheetPersonnes);
    workbook.Sheets['Personnes'] = newSheet;
    XLSX.writeFile(workbook, file);
}


// Fonction pour lire le fichier Excel et effectuer la recherche
function readAndSearchExcel() {
    console.log("try read excel");

    let file = path.join(__dirname, "data/dataFormation.xlsx");

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
    // Convertir les deux chaînes en minuscules (ou en majuscules)
    var chaine1Min = chaine1.toLowerCase();
    var chaine2Min = chaine2.toLowerCase();

    // Comparer les chaînes converties
    return chaine2Min.includes(chaine1Min);
}