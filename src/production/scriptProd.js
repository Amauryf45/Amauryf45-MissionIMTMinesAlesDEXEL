const title_el = document.getElementById("title");
title_el.innerText = api.title;




//navBAr
const accesPages = [document.getElementById("accesAccueil"),
document.getElementById("accesFormation"),
document.getElementById("accesAffectation")];

accesPages.forEach((page,jndex)=>{
	page.classList.add("hideElement");
	document.getElementById("selectLine"+jndex).classList.remove("selectedLine");
})
document.getElementById("selectLine"+1).classList.add("selectedLine");


window.addEventListener('scroll', function() {
    let menu = document.getElementById('header');
    let newHeight = 18 - window.scrollY/10; // Exemple de calcul, à ajuster selon besoin
    newHeight = Math.max(newHeight, 10); // Limiter la hauteur minimale à 10px
    menu.style.height = newHeight + 'vh';
    document.getElementById("lineHeader").style.top = (newHeight+2)+'vh';
    this.document.getElementById("menu").style.top = (newHeight-6.5)+'vh';
});


//fin navBar



const divPersonnel = document.getElementById("divPersonnel");
const divPoste = document.getElementById("divPoste");

const personnelButton = document.getElementById("personnelButton");
const posteButton = document.getElementById("posteButton");
let page = 0;

personnelButton.style.backgroundColor = "lemonchiffon";
posteButton.style.backgroundColor = "khaki";

personnelButton.addEventListener("click",()=>{
    if(page==1){
        divPersonnel.classList.remove("hideElement");
        divPoste.classList.add("hideElement");
        personnelButton.style.backgroundColor = "lemonchiffon";
        posteButton.style.backgroundColor = "khaki";
        page = 0;
    }
})

posteButton.addEventListener("click",()=>{
    if(page==0){
        divPoste.classList.remove("hideElement");
        divPersonnel.classList.add("hideElement");
        posteButton.style.backgroundColor = "lemonchiffon";
        personnelButton.style.backgroundColor = "khaki";
        page = 1;
    }
})


displayEmploye(""); //initialement on affiche tous les employés

const tablePersonnel = document.getElementById("tablePersonnel");

const searchInputPersonnel = document.getElementById("searchInputPersonnel");
searchInputPersonnel.addEventListener('input', () => {
    displayEmploye(searchInputPersonnel.value);
});

async function displayEmploye(filter) {
    console.log(filter);

    //get the people ok with the filter
    const res = await api.checkEmployee(filter);

    //reset tab
    for (var i = tablePersonnel.rows.length - 1; i > 0; i--) {
        if (!tablePersonnel.rows[i].parentNode.tagName.includes("THEAD")) {
            // Supprimer la ligne si elle n'est pas dans le thead
            tablePersonnel.deleteRow(i);
        }
    }

    res.listeEmployee.forEach(personne => {
        var row = tablePersonnel.insertRow(); // Insère une nouvelle ligne

        var cellGenre = row.insertCell(0); // Insère la première cellule
        cellGenre.textContent = personne.Genre; // Définit le texte de la cellule

        var cellNom = row.insertCell(1); // Insère la deuxième cellule
        cellNom.textContent = personne.Nom;

        var cellPrenom = row.insertCell(2); // Insère la troisième cellule
        cellPrenom.textContent = personne.Prenom;

        var cellFormation = row.insertCell(3);
        var formationButton = document.createElement("button");
        formationButton.textContent = "Profil";
        formationButton.classList.add("formationButton");
        formationButton.id = "formationButton"+personne.ID_Personne;
        formationButton.addEventListener('click',()=>{
            api.openPersonnePopUp(personne);
        })
        cellFormation.style.textAlign = "center";
        cellFormation.appendChild(formationButton);
    })
}

function closePersonnePopUp(){
    displayEmploye(searchInputPersonnel? searchInputPersonnel.value  : "");
}

const addEmployeButton = document.getElementById("addEmployeButton");

addEmployeButton.addEventListener("click", async ()=>{
    newID = (+((await api.checkEmployee('')).listeEmployee.pop().ID_Personne)) + 1; //convert to number the last id given and add 1
    newPersonne = {ID_Personne: newID, Genre: 'N.D.', Nom: 'Nom', Prenom: 'Prenom', Info:''};
    api.openPersonnePopUp(newPersonne);
})





//Pour les postes 



displayPoste(""); //initialement on affiche tous les employés

const tablePoste = document.getElementById("tablePoste");

const searchInputPoste = document.getElementById("searchInputPoste");
searchInputPoste.addEventListener('input', () => {
    displayPoste(searchInputPoste.value);
});

async function displayPoste(filter) {
    console.log(filter);

    //get the people ok with the filter
    const res = await api.getAllPostes(filter); 

    //reset tab
    for (var i = tablePoste.rows.length - 1; i > 0; i--) {
        if (!tablePoste.rows[i].parentNode.tagName.includes("THEAD")) {
            // Supprimer la ligne si elle n'est pas dans le thead
            tablePoste.deleteRow(i);
        }
    }

    res.allPostes.forEach(poste => {
        var row = tablePoste.insertRow(); // Insère une nouvelle ligne

        var cellCat = row.insertCell(0); // Insère la première cellule
        cellCat.textContent = poste.Categorie; // Définit le texte de la cellule

        var cellNum = row.insertCell(1); // Insère la deuxième cellule
        cellNum.textContent = poste.ID_Poste;

        var cellNom = row.insertCell(2); // Insère la troisième cellule
        cellNom.textContent = poste.NomPoste;

        var cellPersonnes = row.insertCell(3);
        var employeeButton = document.createElement("button");
        employeeButton.textContent = "Poste";
        employeeButton.classList.add("formationButton");
        employeeButton.id = "employeeButton"+poste.ID_Poste;
        employeeButton.addEventListener('click',()=>{
            api.openPostePopUp(poste); 
        })
        cellPersonnes.style.textAlign = "center";
        cellPersonnes.appendChild(employeeButton);
    })
}


function closePostePopUp(){
    displayPoste(searchInputPoste ? searchInputPoste.value  : "");
}

const addPosteButton = document.getElementById("addPosteButton");

addPosteButton.addEventListener("click", async ()=>{
    newID = (+((await api.getAllPostes('')).listeEmployee.pop().ID_Personne)) + 1; //convert to number the last id given and add 1
    newPoste = {ID_Poste: newID, NomPoste: 'Nom du Poste', Categorie: 'Catégorie', InfoPoste : ""};
    api.openPostePopUp(newPoste);
})

