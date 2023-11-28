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


const options = {
    "apte": "Apte",
    "arevoir": "À revoir",
    "inapte": "Inapte"
};


async function displayFormationsFiche(formationDetails) {
    //tableFormationFiche
    const listeCompetence = formationDetails.Competences.split(";");

    for (let i = tableFormationFiche.rows.length - 1; i > 0; i--) {
        if (!tableFormationFiche.rows[i].parentNode.tagName.includes("THEAD")) {
            // Supprimer la ligne si elle n'est pas dans le thead
            tableFormationFiche.deleteRow(i);
        }
    }

    listeCompetence.forEach(async (competence, index) => {
        const competenceInfos = (await api.getCompetenceInfo(competence)).infoCompetence;
        const persCompInfos = (await api.getPersonneCompetence(personne.ID_Personne, competence)).infoPersComp;

        let row = tableFormationFiche.insertRow(); // Insère une nouvelle ligne

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
        formateurInput.addEventListener('change', function () {
            if (this.checked) {
                // La case est cochée
                api.updateValidFormation(true, personne.ID_Personne, competence);
            } else {
                // La case est décochée
                api.updateValidFormation(false, personne.ID_Personne, competence);
            }
        });
        const formateurLabel = document.createElement("label");
        formateurLabel.classList.add("checkbox-label");
        formateurLabel.setAttribute("for", "maCheckBox" + index)
        cellValidation.appendChild(formateurInput);
        cellValidation.appendChild(formateurLabel);

        let cellType = row.insertCell(2); // Insère la troisième cellule ...
        const select = document.createElement("select");
        select.name = "validation_evaluateur";
        for (let valeur in options) {
            let option = document.createElement("option");
            option.value = valeur;
            option.textContent = options[valeur];
            select.appendChild(option);
        }
        select.value = "inapte";
        if (persCompInfos) {
            select.value = persCompInfos.Niveau;
        }
        cellType.appendChild(select);

    })
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

    api.updateFormationPersonnes(currentPersonneFormationDisplayedID, newValue);
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
    return (await api.getAllPostes()).allPostes;
}

let postes = getPostes(); // Votre liste de formations
let inputFormation = document.getElementById("inputNewFormation");
let listeFormations = document.getElementById("listeFormations");
let newPosteSelect;

inputFormation.addEventListener("input", () => {
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
    console.log("change")
    let filtre = inputFormation.value;

    postes.then(allPoste => {

        allPoste.forEach(async (poste) => {

            if ((poste.ID_Poste + " : " + poste.NomPoste).includes(filtre)) {
                newPosteSelect = poste
                console.log("selected : " + poste);
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


document.getElementById("newFormationButton").addEventListener("click", async () => {
    document.getElementById("quelleFormation").classList.remove("hideElement");
})



document.getElementById("quelleFormationValider").addEventListener("click", async () => {

    if (inputFormation.value != "") { //être sur que y'a pas une ancienne valeur sauvegardé alors qu'il a rien écrit
        newPosteID = newPosteSelect.ID_Poste;
        newPosteType = typeDeNewFormation.value;

        console.log("posteID : " + newPosteID + ", posteType : " + newPosteType)


        let ID_Formation = (await api.getFormationID(newPosteID, newPosteType)).formationID;

        console.log("ID_Formation :" + ID_Formation);

        if (ID_Formation == -1) {
            //Creer une nouvelle formation ?
            nouvelleFormation.classList.remove("hideElement");
            blur.classList.remove("hideElement");

            const nouvelleFormation = document.getElementById("nouvelleFormation");

            document.getElementById("pasNouvelleFormation").addEventListener("click", () => {
                nouvelleFormation.classList.add("hideElement");
                blur.classList.add("hideElement");
            })

            document.getElementById("nouvelleFormation").addEventListener("click", () => {
                newFormationID = api.createFormation(newPosteID, newPosteType);
                nouvelleFormation.classList.add("hideElement");
                blur.classList.add("hideElement");
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
})

document.getElementById("quelleFormationAnnuler").addEventListener('click', () => {
    document.getElementById("quelleFormation").classList.add("hideElement");
    inputFormation.value = "";
})