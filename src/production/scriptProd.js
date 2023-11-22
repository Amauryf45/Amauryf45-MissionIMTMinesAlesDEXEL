const title_el = document.getElementById("title");
title_el.innerText = api.title;

displayEmploye(""); //initialement on affiche tous les employés

const tablePersonnel = document.getElementById("tablePersonnel");

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener('input', () => {
    displayEmploye(searchInput.value);
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

    console.log(res)

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
        formationButton.textContent = "Voir les formations";
        formationButton.classList.add("formationButton");
        formationButton.id = "formationButton"+personne.ID_Personne;
        cellFormation.appendChild(formationButton);
    })
}