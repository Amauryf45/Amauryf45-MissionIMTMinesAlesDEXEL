
const title_el = document.getElementById("title");
title_el.innerText = api.title;


//navBAr
const pages = [document.getElementById("pageAccueil"),
document.getElementById("pageFormation"),
document.getElementById("pageAffectation")];

const accesPages = [document.getElementById("accesAccueil"),
document.getElementById("accesFormation"),
document.getElementById("accesAffectation")];

pages.forEach((page,jndex)=>{
	page.classList.add("hideElement");
	document.getElementById("selectLine"+jndex).classList.remove("selectedLine");
})
pages[0].classList.remove("hideElement");
document.getElementById("selectLine"+0).classList.add("selectedLine");

accesPages.forEach((acces,index)=>{
	acces.addEventListener("click",()=>{
		pages.forEach((page,jndex)=>{
			page.classList.add("hideElement");
			document.getElementById("selectLine"+jndex).classList.remove("selectedLine");
		})
		pages[index].classList.remove("hideElement");
		document.getElementById("selectLine"+index).classList.add("selectedLine");
	})
})

//fin navBar


// Supposons que l'URL soit quelque chose comme "http://monsite.com/page?param1=valeur1&param2=valeur2"

// Obtenir la chaîne de requête de l'URL
let queryString = window.location.search;

// Utiliser URLSearchParams pour analyser la chaîne de requête
let urlParams = new URLSearchParams(queryString);

// Extraire les valeurs des paramètres
let param1 = urlParams.get('page');

pages.forEach((page,jndex)=>{
	page.classList.add("hideElement");
	document.getElementById("selectLine"+jndex).classList.remove("selectedLine");
})
pages[+param1].classList.remove("hideElement");
document.getElementById("selectLine"+param1).classList.add("selectedLine");



