
function chargerDonnees(nbrjours) {
    fetch('../data/temperatures_2022.json')
        .then(resp => {
            //promise1 
            return resp.json();
        })
        .then(resultat => {
            //promise2
            traiterMeteoJours(nbrjours, resultat.temperatures)
        })
}

// prend en entrée le nombre des jours à afficher (1, 3, 7, 14 ou 30)
// et le tableau json du fichier.
//retrouve les information à affichers, le compléter et les afficher. elle traite aussi lles statistiques
function traiterMeteoJours(nbrJours, meteoAnnee){
    var joursDonneesAAfficher = [];
    if (nbrJours == 99) {
        joursDonneesAAfficher = getJoursDonneesAAfficherMois(meteoAnnee);
    } else {
        joursDonneesAAfficher = getJoursDonneesAAfficher(nbrJours, meteoAnnee);
    }

    afficherMeteoJours(joursDonneesAAfficher);
    afficherStatistiques(joursDonneesAAfficher);

}



// prend en entrée le nombre des jours à afficher (1, 3, 7, 14 ou 30)
// et le tableau json du fichier.
// construit le contenu du tableau predefinie en html en ajoutant des lignes et
// colonnes dependement des nombres des jours.
function afficherMeteoJours(joursDonneesAAfficher) {

    const tableContenur = document.getElementById("tableConteneur");
    tableContenur.innerHTML = ''; 

    var trElement = null;
    for (let i = 0; i < joursDonneesAAfficher.length; i++) {
        if (i % 7 == 0) {
            trElement = document.createElement('tr');
            tableContenur.appendChild(trElement);
        }
        const td1 = document.createElement('td');
        td1.innerHTML = getMeteoJourHtml(joursDonneesAAfficher[i]);
        trElement.appendChild(td1);
    }
}

// Retourner les journées à afficher avec les bonnes informations
//date formatée, icone seleon temperature
//le resultat et un tableau des objets
function getJoursDonneesAAfficher(nbrjours, meteoAnnee) {
    const donneesJours = [];
    var indiceToday = getIndiceAujourdhui(meteoAnnee);
    if (indiceToday > 0) {
        for (let indexj = 1; indexj <= nbrjours; indexj++) {
            dateJourInfo = meteoAnnee[indiceToday + indexj - 1];
            if (dateJourInfo !== undefined) {
                //Frmatter date et icone et ajouter au tableu à retourner
                donneesJours.push(getInfoJourFormattee(dateJourInfo));
            }
        }
    }
    return donneesJours;
}

//retrouver l'indice de la journee en cours dans le tableau du meteo de l'année
function getIndiceAujourdhui(meteoAnnee) {
    var indiceToday = -1;
    dateJour = new Date().toLocaleDateString('fr-CA')
    for (let index = 0; index < meteoAnnee.length; index++) {
        if (meteoAnnee[index].DateDuJour == dateJour) {
            indiceToday = index;
            break;
        }
    }
    return indiceToday;
}

// Retourner les journées à afficher avec les bonnes informations
//date formatée, icone seleon temperature
//le resultat et un tableau des objets
function getJoursDonneesAAfficherMois(meteoAnnee) {
    const donneesJours = [];
    var joursMois = []

    //Extraire les journees qui corresponedent au mois selectionné
    var mois = document.getElementById('mois-selection').value;

    //si moiselectionnée est vide, recharge les donnees du mois en cours
    if (mois==='00'){
        location.reload();
        return;
    }

    for (let index = 0; index < meteoAnnee.length; index++) {
        if (meteoAnnee[index].DateDuJour.substring(5, 7) === mois)
            joursMois.push(meteoAnnee[index]);
    }

    //formatter date et icone
    for (let index = 0; index < joursMois.length; index++) {
        donneesJours.push(getInfoJourFormattee(joursMois[index]));
    }

    return donneesJours;
}



function getInfoJourFormattee(dateJourInfo) {
    let dateDuJourformater = new Date(dateJourInfo.DateDuJour + 'T00:00:00').toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return {
        "dateJour": dateDuJourformater,
        "Temp": dateJourInfo.Temp,
        "MaxTemp": dateJourInfo.MaxTemp,
        "MinTemp": dateJourInfo.MinTemp,
        "ImageSrc": getImageSrc(dateJourInfo.Temp)
    };
}

//chercher la bonne image selon la temperature
function getImageSrc(temp) {
    if (temp < 0) {
        return '..\\imgs\\neige.jpg';
    } else if (temp > 10) {
        return '..\\imgs\\soleil.png';
    }
    else
        return '..\\imgs\\nuage.png';

}

//retourne le contenue d'une cellule du tableau 
//en inserrant les donnés du jours fromattés
//le recultat est string html
function getMeteoJourHtml(donneesJour) {
    return `<div class="container-cell">
                <div class="text-center fw-bold mt-5 px-5 date-text" ><p>${donneesJour.dateJour}</p></div>               
                <div class="text-center degre" > <p>${donneesJour.Temp} C</p>
                <img class="taille-image" src="${donneesJour.ImageSrc}">
                </div>

                <div class="tmax bg-warning my-3 mx-4 py-2 px-2" >
                    <span>T. Max. ${donneesJour.MaxTemp} C</span> 
                </div>
                <div class="tmax bg-info my-3 mx-4 py-2 px-2 " >
                    <span>T. Min.  ${donneesJour.MinTemp} C</span> 
                </div>
        </div>`;
}

function afficherStatistiques(joursDonneesAAfficher) {
    if (joursDonneesAAfficher.length <=14)
        return;

    var moyenne =0;
    var min = 100;
    var max = -100;
    var somme=0;

    for (let i = 0; i < joursDonneesAAfficher.length; i++) {
        
        somme+=joursDonneesAAfficher[i].Temp;
        min=joursDonneesAAfficher[i].Temp <min?joursDonneesAAfficher[i].Temp:min;
        max=joursDonneesAAfficher[i].Temp >max?joursDonneesAAfficher[i].Temp:max;
    }
     moyenne = Math.trunc(somme / joursDonneesAAfficher.length);

    const tempMoy = document.getElementById("temp-moy");
    tempMoy.innerHTML=moyenne;

    const tempHaut = document.getElementById("temp-haut");
    tempHaut.innerHTML=max;

    const tempBas = document.getElementById("temp-bas");
    tempBas.innerHTML=min;
   
}


