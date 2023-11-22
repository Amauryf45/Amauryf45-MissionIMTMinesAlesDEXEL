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

    ipcMain.handle('create-file',(req,data)=>{
        if(!data || !data.title || !data.content) return false;

        const filePath = path.join(__dirname, 'data', `${data.title}.txt`);
        fs.writeFileSync(filePath,data.content);

        readAndSearchExcel();

        return{ success:true, filePath};
    })

    window.loadFile('src/accueil.html')
}

app.whenReady().then(createWindow);

app.on('window-all-closed',()=>{
    if (process.platform !== 'darwin') app.quit();
})




// Fonction pour lire le fichier Excel et effectuer la recherche
function readAndSearchExcel() {

    console.log("try read excel");

    let file = path.join(__dirname,"dataFormation.xlsx");

    // Lire le fichier Excel
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

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
    };

    reader.readAsArrayBuffer(file);
}

