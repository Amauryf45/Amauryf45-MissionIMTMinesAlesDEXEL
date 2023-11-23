let personne;

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
}
const title_el = document.getElementById("title");
title_el.innerText = 'Fiche de poste - ' + nom + ' ' + prenom;


let editButton = document.getElementById("modificationButton");

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
                if(index == 4){ //textarea avec retour à la ligne
                    element.value = tempInfos[index-1].replace(/<br\s*[\/]?>/gi, '\n');
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
        document.querySelectorAll(".editInput").forEach((element,index) => {
            element.classList.add("hideElement");
            if (index > 0) { //ignore the picture
                tempInfos.push(element.value);
            }
        });
        document.querySelectorAll(".infoElement").forEach((element,index) => {
            element.classList.remove("hideElement");
            if(index == 3){ //textarea avec retour à la ligne
                element.innerHTML = tempInfos[index].replace(/\n/g, '<br>');
            }
            else{
                element.innerHTML = tempInfos[index];
            }
        });
        sendNewData();
        editButton.textContent = "Modifier le profil";
    }
})


function sendNewData(){
    personne.Genre = genre.innerHTML;
    personne.Nom = nom.innerHTML;
    personne.Prenom = prenom.innerHTML;
    personne.Info = info.innerHTML;
    console.log(personne);
    api.updatePersonne(personne);
}



