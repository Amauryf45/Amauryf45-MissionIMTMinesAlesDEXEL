const {app, BrowserWindow, ipcMain} = require('electron');
const { windowsStore } = require('process');
const path = require("path");
const fs = require("fs");

const XLSX = require("xlsx");


function createWindow (){
    const window = new BrowserWindow({
        height : 720,
        width : 1080,
        webPreferences:{
            preload : path.join(__dirname,'preload.js')
        }
    });
    
    window.maximize();

    ipcMain.handle('create-file',(req,data)=>{
        if(!data || !data.title || !data.content) return false;

        const filePath = path.join(__dirname, 'data', `${data.title}.txt`);
        fs.writeFileSync(filePath,data.content);

        readAndSearchExcel();

        return{ success:true, filePath};
    })

    ipcMain.handle('employeData',(req,filter)=>{

        let listeEmployee = getEmployee(filter);

        return{listeEmployee}
    })

    window.loadFile('src/accueil.html')
}

app.whenReady().then(createWindow);

app.on('window-all-closed',()=>{
    if (process.platform !== 'darwin') app.quit();
})



function getEmployee(filter){
    let file = path.join(__dirname, "data/dataFormation.xlsx");

    // Lire le fichier Excel
    let buffer = fs.readFileSync(file);
    let workbook = XLSX.read(buffer, {type: 'buffer'});

    // Extraire les données des feuilles
    let sheetPersonnes = XLSX.utils.sheet_to_json(workbook.Sheets['Personnes']);

    sheetPersonnes.forEach(p=>console.log(p));

    let filteredEmployes = sheetPersonnes.filter(personne => (comparerChaines(filter,personne.Genre)||comparerChaines(filter,personne.Prenom)||comparerChaines(filter,personne.Nom)));

    console.log(filteredEmployes);
    
    return filteredEmployes
}


// Fonction pour lire le fichier Excel et effectuer la recherche
function readAndSearchExcel() {
    console.log("try read excel");

    let file = path.join(__dirname, "data/dataFormation.xlsx");

    // Lire le fichier Excel
    var buffer = fs.readFileSync(file);
    var workbook = XLSX.read(buffer, {type: 'buffer'});

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