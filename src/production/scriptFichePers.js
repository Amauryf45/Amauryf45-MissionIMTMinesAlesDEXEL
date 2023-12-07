let personne;

const title_el = document.getElementById("title");

const blur = document.getElementById("blur");

const ficheEmploye = document.getElementById("ficheEmploye");
const ficheFormation = document.getElementById("ficheFormation");


const genre = document.getElementById("genre");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const info = document.getElementById("info");

//launched by Main at the launch of the window
function updatePersData(data) {
    personne = data;
    genre.innerHTML = data.Genre; //
    nom.innerHTML = data.Nom; //
    prenom.innerHTML = data.Prenom;
    info.innerHTML = data.Info;

    title_el.innerText = 'Fiche de poste - ' + data.Nom + ' ' + data.Prenom;

    displayFormations(personne);
}

const annulerButton = document.getElementById("anulerModifButton");
annulerButton.addEventListener("click", () => {
    document.querySelectorAll(".editInput").forEach((element, index) => {
        element.classList.add("hideElement");
    });
    document.querySelectorAll(".infoElement").forEach((element, index) => {
        element.classList.remove("hideElement");
    });
    editButton.textContent = "Modifier le profil";
});


const suppProfilButton = document.getElementById("suppProfilButton");
const etesVousSur = document.getElementById("etesVousSur");
suppProfilButton.addEventListener("click", () => {
    etesVousSur.classList.remove("hideElement");
    blur.classList.remove("hideElement");
});

document.getElementById("etesVousSurNON").addEventListener("click", () => {
    etesVousSur.classList.add("hideElement");
    blur.classList.add("hideElement");
})

document.getElementById("etesVousSurOUI").addEventListener("click", () => {
    api.removePersonne(personne.ID_Personne);
    api.closeCurrentWindow();
})



const editButton = document.getElementById("modificationButton");

editButton.addEventListener("click", () => {
    let tempInfos = [];
    if (editButton.innerHTML == "Modifier le profil") {
        document.querySelectorAll(".infoElement").forEach((element, index) => {
            element.classList.add("hideElement");
            tempInfos.push(element.innerHTML);
        });
        document.querySelectorAll(".editInput").forEach((element, index) => {
            element.classList.remove("hideElement");
            if (index > 0) { //ignore the picture
                if (index == 4) { //textarea avec retour à la ligne
                    element.value = tempInfos[index - 1].replace(/<br\s*[\/]?>/gi, '\n');
                }
                else {
                    element.value = tempInfos[index - 1];
                }
            }
        });
        editButton.textContent = "Valider";
    }
    else {
        let tempInfos = [];
        document.querySelectorAll(".editInput").forEach((element, index) => {
            element.classList.add("hideElement");
            if (index > 0) { //ignore the picture
                tempInfos.push(element.value);
            }
        });
        document.querySelectorAll(".infoElement").forEach((element, index) => {
            element.classList.remove("hideElement");
            if (index == 3) { //textarea avec retour à la ligne
                element.innerHTML = tempInfos[index].replace(/\n/g, '<br>');
            }
            else {
                element.innerHTML = tempInfos[index];
            }
        });
        sendNewData();
        editButton.textContent = "Modifier le profil";
    }
})


function sendNewData() {
    personne.Genre = genre.innerHTML;
    personne.Nom = nom.innerHTML;
    personne.Prenom = prenom.innerHTML;
    personne.Info = info.innerHTML;
    console.log(personne);
    api.updatePersonne(personne);
}


//affichage des formations

const tableFormation = document.getElementById("tableFormationsPersonne")

let currentPersonneFormationDisplayedID;

let currentPosteDisplayedID;

async function displayFormations(employe) {

    //get the people ok with the filter
    const res = await api.getFormationsPersonne(employe.ID_Personne);

    //reset tab
    for (let i = tableFormation.rows.length - 1; i > 0; i--) {
        if (!tableFormation.rows[i].parentNode.tagName.includes("THEAD")) {
            // Supprimer la ligne si elle n'est pas dans le thead
            tableFormation.deleteRow(i);
        }
    }

    res.listeFormations.forEach(async formation => {
        let row = tableFormation.insertRow(); // Insère une nouvelle ligne

        const poste = (await api.getPosteInfo(formation.ID_Formation)).infoPoste;
        const formationDetails = (await api.getFormationInfo(formation.ID_Formation)).infoFormation;

        let cellCategorie = row.insertCell(0); // Insère la première cellule
        cellCategorie.textContent = poste.Categorie; // Définit le texte de la cellule

        let cellPoste = row.insertCell(1); // Insère la deuxième cellule
        cellPoste.textContent = poste.ID_Poste;

        let cellType = row.insertCell(2); // Insère la troisième cellule ...
        cellType.textContent = formationDetails.TypeFormation;

        let cellNom = row.insertCell(3);
        cellNom.textContent = poste.NomPoste;

        let cellDate = row.insertCell(4);
        cellDate.textContent = formation.Date;

        let cellNiveau = row.insertCell(5);
        cellNiveau.textContent = formation.Niveau;

        let cellCompetences = row.insertCell(6);
        let competenceButton = document.createElement("button");
        competenceButton.textContent = "Fiche";
        competenceButton.classList.add("competenceButton");
        competenceButton.id = "competenceButton" + formation.ID_PersonneFormation;
        competenceButton.addEventListener('click', () => {
            ficheEmploye.classList.add("hideElement");
            ficheFormation.classList.remove("hideElement");
            updateFiche(formation.ID_PersonneFormation);
        })
        cellCompetences.appendChild(competenceButton);
    })
}

document.getElementById("annulerFicheButton").addEventListener('click', () => {
    ficheEmploye.classList.remove("hideElement");
    ficheFormation.classList.add("hideElement");
    clearTextField();
})

document.getElementById("sauvegarderFicheButton").addEventListener('click', () => {
    sauvegarderFiche();
    ficheEmploye.classList.remove("hideElement");
    ficheFormation.classList.add("hideElement");
    clearTextField();
})

const infoPosteFiche = document.getElementById("infoPosteFiche");
const infoPersonneFiche = document.getElementById("infoPersonneFiche");

const tableFormationFiche = document.getElementById("tableFormationFiche");

const editFormateur = document.getElementById("editFormateur");
const infoFormateurFormation = document.getElementById("infoFormateurFormation");
const formateurInputFormation = document.getElementById("formateurInputFormation");
editFormateur.addEventListener('click', () => {
    if (formateurInputFormation.classList.contains("hideElement")) {
        formateurInputFormation.classList.remove("hideElement");
        infoFormateurFormation.classList.add('hideElement');
        formateurInputFormation.value = infoFormateurFormation.innerHTML;
    }
    else {
        formateurInputFormation.classList.add("hideElement");
        infoFormateurFormation.classList.remove('hideElement');

    }
});
formateurInputFormation.addEventListener('input', () => {
    infoFormateurFormation.innerHTML = formateurInputFormation.value;
});

const editEvaluateur = document.getElementById("editEvaluateur");
const infoEvaluateurFormation = document.getElementById("infoEvaluateurFormation");
const evaluateurInputFormation = document.getElementById("evaluateurInputFormation");
editEvaluateur.addEventListener('click', () => {
    if (evaluateurInputFormation.classList.contains("hideElement")) {
        evaluateurInputFormation.classList.remove("hideElement");
        infoEvaluateurFormation.classList.add('hideElement');
        evaluateurInputFormation.value = infoEvaluateurFormation.innerHTML;
    }
    else {
        evaluateurInputFormation.classList.add("hideElement");
        infoEvaluateurFormation.classList.remove('hideElement');

    }
});
evaluateurInputFormation.addEventListener('input', () => {
    infoEvaluateurFormation.innerHTML = evaluateurInputFormation.value;
});

const editDate = document.getElementById("editDate");
const infoDateFormation = document.getElementById("infoDateFormation");
const dateInputFormation = document.getElementById("dateInputFormation");
editDate.addEventListener('click', () => {
    if (dateInputFormation.classList.contains("hideElement")) {
        dateInputFormation.classList.remove("hideElement");
        infoDateFormation.classList.add('hideElement');
        dateInputFormation.value = infoDateFormation.innerHTML;
    }
    else {
        dateInputFormation.classList.add("hideElement");
        infoDateFormation.classList.remove('hideElement');

    }
});
dateInputFormation.addEventListener('input', () => {
    infoDateFormation.innerHTML = dateInputFormation.value;
});

const editProduit = document.getElementById("editProduit");
const infoProduitFormation = document.getElementById("infoProduitFormation");
const produitInputFormation = document.getElementById("produitInputFormation");
editProduit.addEventListener('click', () => {
    if (produitInputFormation.classList.contains("hideElement")) {
        produitInputFormation.classList.remove("hideElement");
        infoProduitFormation.classList.add('hideElement');
        produitInputFormation.value = infoProduitFormation.innerHTML;
    }
    else {
        produitInputFormation.classList.add("hideElement");
        infoProduitFormation.classList.remove('hideElement');

    }
});
produitInputFormation.addEventListener('input', () => {
    infoProduitFormation.innerHTML = produitInputFormation.value;
});

const editBilan = document.getElementById("editBilan");
const infoBilanFormation = document.getElementById("infoBilanFormation");
const bilanInputFormation = document.getElementById("bilanInputFormation");
editBilan.addEventListener('click', () => {
    if (bilanInputFormation.classList.contains("hideElement")) {
        bilanInputFormation.classList.remove("hideElement");
        infoBilanFormation.classList.add('hideElement');
        bilanInputFormation.value = infoBilanFormation.innerHTML;
    }
    else {
        bilanInputFormation.classList.add("hideElement");
        infoBilanFormation.classList.remove('hideElement');

    }
});

bilanInputFormation.addEventListener('input', () => {
    infoBilanFormation.innerHTML = bilanInputFormation.value;
    if (bilanInputFormation.value == "Apte") {
        document.getElementById("niveauFormation").classList.remove("hideElement");
    }
    else {
        document.getElementById("niveauFormation").classList.add("hideElement");
        document.getElementById("niveauInputFormation").value = "1";
    }
});

const editNiveau = document.getElementById("editNiveau");
const infoNiveauFormation = document.getElementById("infoNiveauFormation");
const niveauInputFormation = document.getElementById("niveauInputFormation");
editNiveau.addEventListener('click', () => {
    if (niveauInputFormation.classList.contains("hideElement")) {
        niveauInputFormation.classList.remove("hideElement");
        infoNiveauFormation.classList.add('hideElement');
        niveauInputFormation.value = infoNiveauFormation.innerHTML;
    }
    else {
        niveauInputFormation.classList.add("hideElement");
        infoNiveauFormation.classList.remove('hideElement');

    }
});
niveauInputFormation.addEventListener('input', () => {
    infoNiveauFormation.innerHTML = niveauInputFormation.value;
});

let listeCompetenceValidationFormateurInput = [];
let listeCompetenceValidationEvaluateurInput = [];
let listeDateInput = [];
const commentaireInputFormation = document.getElementById("commentaireInputFormation");

function clearTextField() {
    formateurInputFormation.classList.add("hideElement");
    infoFormateurFormation.classList.remove('hideElement');

    evaluateurInputFormation.classList.add("hideElement");
    infoEvaluateurFormation.classList.remove('hideElement');

    dateInputFormation.classList.add("hideElement");
    infoDateFormation.classList.remove('hideElement');

    produitInputFormation.classList.add("hideElement");
    infoProduitFormation.classList.remove('hideElement');

    bilanInputFormation.classList.add("hideElement");
    infoBilanFormation.classList.remove('hideElement');

    niveauInputFormation.classList.add("hideElement");
    infoNiveauFormation.classList.remove('hideElement');
}

async function updateFiche(PersonneFormationID) {

    currentPersonneFormationDisplayedID = PersonneFormationID;

    const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == PersonneFormationID);
    const formationDetails = (await api.getFormationInfo(formationPersonnesDetails.ID_Formation)).infoFormation;
    const poste = (await api.getPosteInfo(formationPersonnesDetails.ID_Formation)).infoPoste;

    currentPosteDisplayedID = poste.ID_Poste;


    infoPosteFiche.innerHTML = 'Poste ' + poste.ID_Poste + ' - ' + poste.NomPoste + ' - ' + formationDetails.TypeFormation;

    infoPersonneFiche.innerHTML = personne.Nom + ' ' + personne.Prenom;

    infoFormateurFormation.innerHTML = formationPersonnesDetails.Formateur;

    infoEvaluateurFormation.innerHTML = formationPersonnesDetails.Evaluateur;

    infoDateFormation.innerHTML = formationPersonnesDetails.Date;

    infoProduitFormation.innerHTML = formationPersonnesDetails.Produit;

    infoNiveauFormation.innerHTML = formationPersonnesDetails.Niveau;

    commentaireInputFormation.value = formationPersonnesDetails.Commentaire;

    if (formationPersonnesDetails.Niveau == 1 || formationPersonnesDetails.Niveau == 2 || formationPersonnesDetails.Niveau == 3) {
        infoBilanFormation.innerHTML = "Apte";
    }
    else {
        infoBilanFormation.innerHTML = "Inapte";
        document.getElementById("niveauFormation").classList.add("hideElement");
    }

    displayFormationsFiche(formationDetails);

}


const compAlreadyExist = document.getElementById("compAlreadyExist");
const creerCompetenceButton = document.getElementById("creerCompetenceButton");

async function getAllCompetences() {
    return (await api.getAllCompetences()).allCompetences;
}

let inputCompetence = document.getElementById("inputNewCompetence");
let listeCompetences = document.getElementById("listeCompetences");
let newCompetenceSelect;

inputCompetence.addEventListener("input", () => {
    compAlreadyExist.classList.add("hideElement");
    creerCompetenceButton.disabled = false;
    let competences = getAllCompetences(); // Votre liste de competence
    let filtre = inputCompetence.value.toLowerCase();
    listeCompetences.innerHTML = ""; // Effacer les suggestions existantes

    competences.then(allCompetence => {

        allCompetence.forEach(async (competence) => {

            if (competence.NomComp.toLowerCase().includes(filtre)) {
                let option = document.createElement("option");
                option.value = competence.NomComp;
                listeCompetences.appendChild(option);
            }
        });
    });
});


inputCompetence.addEventListener("focusout", () => {
    let competences = getAllCompetences(); // Votre liste de competence
    console.log("change")
    let filtre = inputCompetence.value;

    newCompetenceSelect = undefined;

    competences.then(allCompetence => {

        allCompetence.forEach(async (competence) => {

            if (competence.NomComp.includes(filtre)) {

                const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == currentPersonneFormationDisplayedID);
                const formationDetails = (await api.getFormationInfo(formationPersonnesDetails.ID_Formation)).infoFormation;
                const listeCompetence = formationDetails.Competences.split(";");

                console.log("listeCompetence : " + listeCompetence)
                console.log("ID_Competence : " + competence.ID_Competence)


                if (contient(listeCompetence, competence.ID_Competence)) {
                    compAlreadyExist.classList.remove("hideElement");
                    creerCompetenceButton.disabled = true;
                }

                newCompetenceSelect = competence;
            }
        });
    });
})


const inputNewCompetence = document.getElementById("inputNewCompetence");
const addCompButton = document.getElementById("addCompButton");
const creerCompetence = document.getElementById("creerCompetence");

const nouvelleCompetence = document.getElementById("nouvelleCompetence");

addCompButton.addEventListener("click", () => {
    creerCompetence.classList.remove("hideElement");
    blur.classList.remove("hideElement");
});

document.getElementById("annulerCompetenceButton").addEventListener("click", () => {
    inputNewCompetence.value = "";
    creerCompetence.classList.add("hideElement");
    blur.classList.add("hideElement");
})


creerCompetenceButton.addEventListener("click", async () => {
    if (newCompetenceSelect) {
        if (newCompetenceSelect.Unique != 1) {
            let newPersComp = { ID_PersonneCompetence: "-1", ID_Personne: personne.ID_Personne, ID_Competence: newCompetenceSelect.ID_Competence, ID_Poste: currentPosteDisplayedID, Formation: "0", Niveau: "non-ev" };
            api.updatePersonneCompetence(newPersComp);
        }
        else {
            let compPers = (await api.getPersonneCompetence(personne.ID_Personne, "0", newCompetenceSelect.ID_Competence)).infoPersComp;
            if (!compPers) { //si c'est une competence unique mais jamais faite par la personne pour l'instant
                let newPersComp = { ID_PersonneCompetence: "-1", ID_Personne: personne.ID_Personne, ID_Competence: newCompetenceSelect.ID_Competence, ID_Poste: "0", Formation: "0", Niveau: "non-ev" };
                api.updatePersonneCompetence(newPersComp);
            }
        }
        const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == currentPersonneFormationDisplayedID);
        api.addCompToForm(newCompetenceSelect.ID_Competence, formationPersonnesDetails.ID_Formation)
        creerCompetence.classList.add("hideElement");
        blur.classList.add("hideElement");
        updateFiche(currentPersonneFormationDisplayedID);
    }
    else {
        nouvelleCompetence.classList.remove("hideElement")
    }
})


document.getElementById("annulerNouvelleCompetenceButton").addEventListener("click", () => {
    nouvelleCompetence.classList.add("hideElement");
    blur.classList.add("hideElement");
})

document.getElementById("creerNouvelleCompetenceButton").addEventListener("click", async () => {
    let unique = checkboxCompetenceUnique.value ? "1" : "0";
    let newCompetence = await api.createCompetence(inputCompetence.value, unique);
    let newIdPoste = checkboxCompetenceUnique.value ? "0" : currentPosteDisplayedID; //peut importe le poste si competence unique => poste "0"
    let newPersComp = { ID_PersonneCompetence: "-1", ID_Personne: personne.ID_Personne, ID_Competence: newCompetence.ID_Competence, ID_Poste: newIdPoste, Formation: "0", Niveau: "non-ev" }
    api.updatePersonneCompetence(newPersComp);
    api.addCompToForm(newCompetence.ID_Competence, currentPersonneFormationDisplayedID.ID_Formation)
    nouvelleCompetence.classList.add("hideElement");
    creerCompetence.classList.add("hideElement")
    blur.classList.add("hideElement");
    updateFiche(currentPersonneFormationDisplayedID);
})


const options = {
    "apte": "Apte",
    "arevoir": "À revoir",
    "inapte": "Inapte",
    "non-ev": "Non evalué"
};

let listeRowCompetence = [];
let isOrdering = false;
competencesOrderButton = document.getElementById("competencesOrderButton");


async function displayFormationsFiche(formationDetails) {

    //tableFormationFiche
    const listeCompetence = formationDetails.Competences.split(";");

    listeRowCompetence = [];
    listeCompetenceValidationFormateurInput = [];
    listeCompetenceValidationEvaluateurInput = [];
    listeDateInput = [];

    for (let i = tableFormationFiche.rows.length - 1; i > 0; i--) {
        if (!tableFormationFiche.rows[i].parentNode.tagName.includes("THEAD")) {
            // Supprimer la ligne si elle n'est pas dans le thead
            tableFormationFiche.deleteRow(i);
        }
    }

    console.log("listecomp : " + listeCompetence)

    Promise.all(listeCompetence.map(async (competence, index) => {
        const competenceInfos = (await api.getCompetenceInfo(competence)).infoCompetence;
        let persCompInfos = (await api.getPersonneCompetence(personne.ID_Personne, currentPosteDisplayedID, competence)).infoPersComp;

        if (!persCompInfos) { 
            let dateForm = document.getElementById("dateAncienneFormation").value;
            console.log(dateForm)
            let isFormed = "0";
            if(dateForm){
                isFormed = "1";
            }
            let newIdPoste = competenceInfos.Unique == "1" ? "0" : currentPosteDisplayedID; //peut importe le poste si competence unique => poste "0"
            persCompInfos = { ID_PersonneCompetence: "-1", ID_Personne: personne.ID_Personne, ID_Competence: competenceInfos.ID_Competence, ID_Poste: newIdPoste, Formation: isFormed, Niveau: "non-ev", DateControle: dateForm }
            await api.updatePersonneCompetence(persCompInfos);
            let createdPersComp = await api.getPersonneCompetence(persCompInfos.ID_Personne,persCompInfos.ID_Poste,persCompInfos.ID_Competence)
            persCompInfos.ID_PersonneCompetence = createdPersComp.infoPersComp.ID_PersonneCompetence;
        }

        let row = tableFormationFiche.insertRow(); // Insère une nouvelle ligne
        listeRowCompetence.push(row);

        let cellNomCompetence = row.insertCell(0); // Insère la première cellule
        cellNomCompetence.classList.add("firstCol");
        console.log(competenceInfos)
        cellNomCompetence.textContent = competenceInfos.NomComp; // Définit le texte de la cellule

        let cellValidation = row.insertCell(1); // Insère la deuxième cellule
        const formateurInput = document.createElement("input");
        formateurInput.type = "checkbox";
        formateurInput.classList.add("checkbox-custom");
        formateurInput.id = "maCheckBox" + index;
        if (persCompInfos && persCompInfos.Formation == 1) {
            console.log("personneFormation : " + persCompInfos.Formation)
            formateurInput.checked = true;
        }
        listeCompetenceValidationFormateurInput.push(formateurInput);

        const formateurLabel = document.createElement("label");
        formateurLabel.classList.add("checkbox-label");
        formateurLabel.setAttribute("for", "maCheckBox" + index)
        cellValidation.appendChild(formateurInput);
        cellValidation.appendChild(formateurLabel);


        let cellDate = row.insertCell(2);
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        if (persCompInfos && persCompInfos.DateControle) {
            dateInput.value = persCompInfos.DateControle;
        }
        listeDateInput.push(dateInput);
        cellDate.appendChild(dateInput);


        let cellType = row.insertCell(3);
        const select = document.createElement("select");
        listeCompetenceValidationEvaluateurInput.push({ theInput: select, thePersCompInfos: persCompInfos })
        select.name = "validation_evaluateur";
        for (let valeur in options) {
            let option = document.createElement("option");
            option.value = valeur;
            option.textContent = options[valeur];
            select.appendChild(option);
        }
        select.value = "non-ev";
        if (persCompInfos) {
            select.value = persCompInfos.Niveau;
        }
        cellType.appendChild(select);


    })).then(() => {
        if (isOrdering) {
            console.log("has diplayed")
            isOrdering = false;
            competencesOrderButton.click();
        }
    })
}


competencesOrderButton.addEventListener("click", () => {
    console.log("modif ?")
    if (isOrdering) {
        listeRowCompetence.forEach(row => {
            row.deleteCell(4);
            competencesOrderButton.textContent = "Modifier";
            isOrdering = false;
        })
    }
    else {
        listeRowCompetence.forEach((row, index) => {
            let cellEditOrder = row.insertCell(4); // Insère une cellule de plus
            let upDownDiv = document.createElement("div");
            cellEditOrder.appendChild(upDownDiv);
            upDownDiv.classList.add("upDownDiv");
            let upButton = document.createElement("button");
            upButton.textContent = "↑";
            upButton.addEventListener("click", () => goUpComp(index));
            upDownDiv.appendChild(upButton);
            let downButton = document.createElement("button");
            downButton.textContent = "↓";
            downButton.addEventListener("click", () => goDownComp(index));
            upDownDiv.appendChild(downButton);
            let delCompButton = document.createElement("button");
            delCompButton.textContent = "supp";
            delCompButton.addEventListener("click", () => delComp(index));
            cellEditOrder.appendChild(delCompButton);
        })
        competencesOrderButton.textContent = "Ok";
        isOrdering = true;
    }
})


async function goUpComp(index) {
    const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == currentPersonneFormationDisplayedID);
    if (index > 0) {
        await api.updateFormationCompOrder(formationPersonnesDetails.ID_Formation, index, "up");
        const formationDetails = (await api.getFormationInfo(formationPersonnesDetails.ID_Formation)).infoFormation;
        displayFormationsFiche(formationDetails)

    }
}

async function goDownComp(index) {
    const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == currentPersonneFormationDisplayedID);
    if (index < listeRowCompetence.length) {
        await api.updateFormationCompOrder(formationPersonnesDetails.ID_Formation, index, "down");
        const formationDetails = (await api.getFormationInfo(formationPersonnesDetails.ID_Formation)).infoFormation;
        displayFormationsFiche(formationDetails)

    }
}

async function delComp(index) {
    const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == currentPersonneFormationDisplayedID);
    await api.updateFormationCompOrder(formationPersonnesDetails.ID_Formation, index, "supp");
    const formationDetails = (await api.getFormationInfo(formationPersonnesDetails.ID_Formation)).infoFormation;
    displayFormationsFiche(formationDetails);

}



async function sauvegarderFiche() {
    const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == currentPersonneFormationDisplayedID);

    newValue = formationPersonnesDetails;
    newValue.Date = infoDateFormation.innerHTML;
    if (infoBilanFormation.innerHTML == "Apte" || bilanInputFormation.value == "apte") {
        newValue.Niveau = infoNiveauFormation.innerHTML;
    }
    else {
        newValue.Niveau = "0"
    }
    newValue.Formateur = infoFormateurFormation.innerHTML;
    newValue.Evaluateur = infoEvaluateurFormation.innerHTML;
    newValue.Produit = infoProduitFormation.innerHTML;
    newValue.Commentaire = commentaireInputFormation.value;

    console.log("newValue : " + newValue)

    api.updateFormationPersonnes(currentPersonneFormationDisplayedID, newValue);

    listeCompetenceValidationEvaluateurInput.forEach((infos, index) => {
        if (infos.thePersCompInfos) {
            infos.thePersCompInfos.Niveau = infos.theInput.value;
            infos.thePersCompInfos.DateControle = listeDateInput[index].value;
            if (infos.thePersCompInfos.Niveau != "apte" && infos.thePersCompInfos.Niveau != "non-ev") {
                listeCompetenceValidationFormateurInput[index].checked = false;
            }
            infos.thePersCompInfos.Formation = listeCompetenceValidationFormateurInput[index].checked ? 1 : 0;
            api.updatePersonneCompetence(infos.thePersCompInfos)
        }
    })

    listeCompetenceValidationFormateurInput.forEach((compInput,index) => {
        if (compInput.checked) {
            // La case est cochée
            api.updateValidFormation(true, personne.ID_Personne, listeCompetenceValidationEvaluateurInput[index].thePersCompInfos.ID_Competence);
        } else {
            // La case est décochée
            api.updateValidFormation(false, personne.ID_Personne,  listeCompetenceValidationEvaluateurInput[index].thePersCompInfos.ID_Competence);
        }
    })

    displayFormations(personne);
}


const suppFicheButton = document.getElementById("suppFicheButton");
const etesVousSurFiche = document.getElementById("etesVousSurFiche");
suppFicheButton.addEventListener("click", () => {
    etesVousSurFiche.classList.remove("hideElement");
    blur.classList.remove("hideElement");
});

document.getElementById("etesVousSurNONFiche").addEventListener("click", () => {
    etesVousSurFiche.classList.add("hideElement");
    blur.classList.add("hideElement");
})

document.getElementById("etesVousSurOUIFiche").addEventListener("click", () => {
    api.removeFormationPersonne(currentPersonneFormationDisplayedID, personne.ID_Personne);
    displayFormations(personne);
    etesVousSurFiche.classList.add("hideElement");
    blur.classList.add("hideElement");
    ficheEmploye.classList.remove("hideElement");
    ficheFormation.classList.add("hideElement");
    clearTextField();
})


//ajout formation 
async function getPostes() {
    return (await api.getAllPostes("")).allPostes;
}

let inputFormation = document.getElementById("inputNewFormation");
let listeFormations = document.getElementById("listeFormations");
let newPosteSelect;

inputFormation.addEventListener("input", () => {
    let postes = getPostes();

    let filtre = inputFormation.value.toLowerCase();
    listeFormations.innerHTML = ""; // Effacer les suggestions existantes

    postes.then(allPoste => {

        allPoste.forEach(async (poste) => {

            if (poste.NomPoste.toLowerCase().includes(filtre) || ("" + poste.ID_Poste).toLowerCase().includes(filtre)) {
                let option = document.createElement("option");
                option.value = poste.ID_Poste + " : " + poste.NomPoste;
                listeFormations.appendChild(option);
            }
        });
    });
});


inputFormation.addEventListener("focusout", () => {
    let postes = getPostes();

    let filtre = inputFormation.value;

    postes.then(allPoste => {

        allPoste.forEach(async (poste) => {

            if ((poste.ID_Poste + " : " + poste.NomPoste).includes(filtre)) {
                newPosteSelect = poste;
                currentPosteDisplayedID = poste.ID_Poste;
            }
        });
    });
})


let typeFormation = ["Fabricant", "Conducteur", "Conditionneur"]; //select les types de formations possible
let typeDeNewFormation = document.getElementById("typeDeNewFormation");
typeFormation.forEach(type => {
    let option = document.createElement("option");
    option.value = type;
    option.innerHTML = type;
    typeDeNewFormation.appendChild(option);
})


document.getElementById("newFormationButton").addEventListener("click", () => {
    document.getElementById("quelleFormation").classList.remove("hideElement");
})



document.getElementById("quelleFormationValider").addEventListener("click", () => {

    if (inputFormation.value != "") { //être sur que y'a pas une ancienne valeur sauvegardé alors qu'il a rien écrit
        quelleFormationValider()
    }
})

document.getElementById("quelleFormationAnnuler").addEventListener('click', () => {
    document.getElementById("quelleFormation").classList.add("hideElement");
    inputFormation.value = "";
})

async function quelleFormationValider() {
    newPosteID = newPosteSelect.ID_Poste;
    newPosteType = typeDeNewFormation.value;

    console.log("posteID : " + newPosteID + ", posteType : " + newPosteType)


    let ID_Formation = (await api.getFormationID(newPosteID, newPosteType)).formationID;

    console.log("ID_Formation :" + ID_Formation);

    if (ID_Formation == -1) {
        //Creer une nouvelle formation ?

        const nouvelleFormation = document.getElementById("nouvelleFormation");
        nouvelleFormation.classList.remove("hideElement");

        blur.classList.remove("hideElement");

        document.getElementById("pasNouvelleFormationButton").addEventListener("click", () => {
            nouvelleFormation.classList.add("hideElement");
            blur.classList.add("hideElement");
        })

        document.getElementById("nouvelleFormationButton").addEventListener("click", () => {
            document.getElementById("quelleFormation").classList.add("hideElement");
            api.createFormation(newPosteID, newPosteType);
            nouvelleFormation.classList.add("hideElement");
            blur.classList.add("hideElement");

            quelleFormationValider()
        })
    }
    else {

        //crée une nouvelle référence de PersonneFormation
        let newID = (+((await api.getPersonneFormationLastIndex()).lastIndex)) + 1;

        let aujourdHui = new Date();
        let annee = aujourdHui.getFullYear();
        let mois = aujourdHui.getMonth() + 1; // Les mois commencent à 0
        let jour = aujourdHui.getDate();

        // Ajouter un zéro devant les mois et jours s'ils sont inférieurs à 10
        mois = mois < 10 ? '0' + mois : mois;
        jour = jour < 10 ? '0' + jour : jour;

        let dateFormatee = annee + '-' + mois + '-' + jour;

        let newPersFormations = { ID_PersonneFormation: newID, ID_Personne: personne.ID_Personne, ID_Formation: ID_Formation, Date: dateFormatee, Niveau: "0", Formateur: "Nom, Prénom", Evaluateur: "Nom, Prénom", Produit: "Produit en cours de production", Commentaire: "" };

        api.updateFormationPersonnes(newID, newPersFormations);

        displayFormations(personne);

        document.getElementById("quelleFormation").classList.add("hideElement");
        inputFormation.value = "";

        ficheEmploye.classList.add("hideElement");
        ficheFormation.classList.remove("hideElement");
        updateFiche(newID);

    }
}





function contient(liste_ID, id) {
    return liste_ID.find(idInList => idInList == id)
}