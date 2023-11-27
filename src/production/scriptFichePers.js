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
        console.log("poste : " + poste)
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
        cellDate.textContent = formation.Date_fin;

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
})

document.getElementById("sauvegarderFicheButton").addEventListener('click', () => {
    sauvegarderFiche();
    ficheEmploye.classList.remove("hideElement");
    ficheFormation.classList.add("hideElement");
})

const infoPosteFiche = document.getElementById("infoPosteFiche");
const infoPersonneFiche = document.getElementById("infoPersonneFiche");

const tableFormationFiche = document.getElementById("tableFormationFiche");

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



async function updateFiche(PersonneFormationID) {

    const formationPersonnesDetails = (await api.getFormationsPersonne(personne.ID_Personne)).listeFormations.find(formPers => formPers.ID_PersonneFormation == PersonneFormationID);
    const formationDetails = (await api.getFormationInfo(formationPersonnesDetails.ID_Formation)).infoFormation;
    const poste = (await api.getPosteInfo(formationPersonnesDetails.ID_Formation)).infoPoste;

    infoPosteFiche.innerHTML = 'Poste ' + poste.ID_Poste + ' - ' + poste.NomPoste + ' - ' + formationDetails.TypeFormation;

    infoPersonneFiche.innerHTML = personne.Nom + ' ' + personne.Prenom;

    infoEvaluateurFormation.innerHTML = formationPersonnesDetails.Formateur;

    infoDateFormation.innerHTML = formationPersonnesDetails.Date;

    infoProduitFormation.innerHTML = formationPersonnesDetails.Produit;

    infoNiveauFormation.innerHTML = formationPersonnesDetails.Niveau;

    if (formationPersonnesDetails.Niveau == 1 || formationPersonnesDetails.Niveau == 2 || formationPersonnesDetails.Niveau == 3) {
        infoBilanFormation.innerHTML = "Apte";
    }
    else {
        infoBilanFormation.innerHTML = "Inapte";
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
        const persCompInfos = (await api.getPersonneCompetence(personne.ID_Personne,competence)).infoPersComp;

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
            console.log("personneFormation : "+ persCompInfos.Formation)
            formateurInput.checked = true;
        } 
        formateurInput.addEventListener('change', function() {
            if (this.checked) {
                // La case est cochée
                api.updateValidFormation(true,personne.ID_Personne,competence);
            } else {
                // La case est décochée
                api.updateValidFormation(false,personne.ID_Personne,competence);
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

function sauvegarderFiche(){
    
}
