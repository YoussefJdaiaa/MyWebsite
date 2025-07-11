function getLinesFromHTML(lines) {
    //on récupère la première ligne comme header et on la retire
    var headers = getCsvValuesFromLine(lines[0]);
    lines.shift();
    //On crée un tableau pour contenir les individus du dataset
    var people = [];
    for (var i = 0; i < lines.length; i += 1) {
        //chaque case est un Object rempli avec les paires clé/valeur
        people[i] = {};
        var lineValues = getCsvValuesFromLine(lines[i]);
        for (var j = 0; j < lineValues.length; j += 1) {
            people[i][headers[j]] = lineValues[j];
        }
    }
    console.log(headers);
    return people;
}


function getCsvValuesFromLine(line) {
    var value = line.split(sep);
    values = value.map(function(value) {
        return value.replace(/\"/g, '');
    });
    return value;
}




function part_Hybride_Non_Hybride(hybride, nonHybride) {
    var data = [{
        type: 'bar',
        x: [hybride, nonHybride],
        y: ['Hybride', 'Non Hybride'],
        orientation: 'h',
        marker: {
            color: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            width: 1
        }
    }];

    var layout = {
        title: 'Part de véhicules hybrides / Non hybrides',
        autosize: true,
        margin: { t: 40, r: 40, l: 40, b: 40 },
        xaxis: {
            title: 'Nombre de véhicules'
        },
        yaxis: {
            automargin: true
        }
    };

    Plotly.newPlot('plot5', data, layout, { responsive: true });
}


function Repartition_vehicule_année(data1, data2) {
    var trace = {
        x: data1,
        y: data2,
        type: 'bar'
    };

    var layout = {
        title: 'Nombre de véhicules par année',
        xaxis: { title: 'Années' },
        yaxis: { title: 'Nombre de véhicules' }
    };

    var data = [trace];

    Plotly.newPlot('plot1', data, layout);
}

function Part_marche_marque(data1, data2) {
    var trace = {
        x: data1,
        y: data2,
        type: 'bar'
    };

    var layout = {
        title: 'Parts des marques sur le marché',
        xaxis: { title: 'Parts de marché' },
        yaxis: { title: 'Marques' }
    };

    var data = [trace];

    Plotly.newPlot('plot6', data, layout);
}


function graphiquePartFournisseurs(labels, values) {
    // Grouper les petites parts dans une catégorie "Autres"
    const threshold = 17; // seuil en pourcentage
    let total = values.reduce((a, b) => a + b, 0);
    let othersValue = 0;
    let newLabels = [];
    let newValues = [];

    for (let i = 0; i < labels.length; i++) {
        let percent = (values[i] / total) * 100;
        if (percent < threshold) {
            othersValue += values[i];
        } else {
            newLabels.push(labels[i]);
            newValues.push(values[i]);
        }
    }

    if (othersValue > 0) {
        newLabels.push("Autres");
        newValues.push(othersValue);
    }

    const data = [{
        type: 'pie',
        labels: newLabels,
        values: newValues,
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true,
        hoverinfo: 'label+percent+name',
        marker: {
            colors: [
                'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ]
        }
    }];

    const layout = {
        margin: { t: 50, l: 50, r: 50, b: 50 },
        showlegend: true,
        legend: {
            x: 0.5,
            xanchor: 'center',
            y: -0.3,
            orientation: 'h'
        }
    };

    Plotly.newPlot('plot3', data, layout);
}




function graphiqueAutonomieMoyenne(moyenne) {
    var data = [{
        type: 'indicator',
        mode: 'gauge+number',
        value: moyenne,
        title: { text: "Autonomie Moyenne (km)", font: { size: 20 } },
        gauge: {
            axis: { range: [null, 500], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "rgba(75, 192, 192, 1)" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 200], color: 'rgba(220, 220, 220, 1)' },
                { range: [200, 400], color: 'rgba(200, 200, 200, 1)' },
                { range: [400, 500], color: 'rgba(180, 180, 180, 1)' }
            ],
        }
    }];

    var layout = {
        width: 450,
        height: 300,
        margin: { t: 10, r: 10, l: 10, b: 10 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
    };

    Plotly.newPlot('plot4', data, layout);
}

var geojson_url = 'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';
function Carte(compté, countiesFIPS, vehicleCounts, geojson_url) {
    fetch(geojson_url)
        .then(response => response.json())
        .then(geojsonData => {
            var data = [{
                type: 'choroplethmapbox',
                geojson: geojsonData,
                locations: countiesFIPS,
                z: vehicleCounts,
                text: compté,
                colorscale: 'Reds',
                colorbar: { title: 'Nombre de véhicules électriques' },
                featureidkey: 'id',  // Ensure this key matches the FIPS codes in your GeoJSON file
                marker: { line: { width: 0.5 } }
            }];

            var layout = {
                mapbox: {
                    style: "carto-positron",
                    zoom: 6,
                    center: { lat: 47.7511, lon: -120.7401 }
                },
                margin: { t: 0, b: 0 }
            };

            Plotly.newPlot('carte', data, layout);
        })
}


var CSVcontent;

//Filereader pour le flux de lecture
const fileInput = document.getElementById('csv')
const readFile = () => {
    const reader = new FileReader()
    reader.onload = () => {
        CSVcontent = reader.result;
    }
    // lit le fichier et appelle l'événement "onload" ensuite
    reader.readAsText(fileInput.files[0])
}

var btn = document.querySelector('button');
btn.onclick = function() {
    // document.getElementById('out').innerHTML = CSVcontent;
    var lines = CSVcontent.split('\n');
    var people = getLinesFromHTML(lines);

    data = Object.values(lines)

    // console.log(getCsvValuesFromLine(lines[0]));
    // console.log(getLinesFromHTML(lines));
    var N = data.length;
    var marque = [];
    var nb_vehicule_par_marque = [];
    var vehicule_par_date = [];
    var autonomie_moyenne = 0;
    var Hybride = 0;
    var NonHybride = 0;
    var Fournisseur = [];
    var part_des_fournisseurs = [];
    var compté = [];
    var nb_vehicule_par_compté = [];

    for (var i = 0; i < 10; i++) {
        vehicule_par_date[i] = 0
    } // ca va de 1997 a 2024 mais nous ne prenons que a partir de 2014 jusqu'à 2023
    // la ou c'est le plus visible, 2024 n'étant pas terminé nous ne la considerons pas non plus
    var années = Array.from({ length: 10 }, (_, i) => 2023 - i);
    // il y a 40 marque
    for (var i = 0; i < 40; i++) {
        nb_vehicule_par_marque[i] = 0;
    }
    // 76 fournisseurs
    for (var i = 0; i < 77; i++) {
        part_des_fournisseurs[i] = 0;

    }

    // il y a 39 comptés

    for (var i = 0; i < 39; i++) {
        nb_vehicule_par_compté[i] = 0
    }
    // creation de la liste marque et des listes dates et vehicule par date
    var C1 = 0;
    var C2 = 0;
    var C3 = 0;
    var C4 = 0;


    var C5 = 0;

    for (var i = 0; i < N - 1; i++) {
        //creation des variables
        var year = data[i + 1].split(',')[5];
        var Eligibility = data[i + 1].split(',')[9];
        var Type_Vehicule = data[i + 1].split(',')[8];
        var Range = data[i + 1].split(',')[10];
        var Mark = data[i + 1].split(',')[6];
        var Part_Hybdride = data[i + 1].split(',')[8];
        var fournisseur = data[i + 1].split(',')[15];
        var compté_washington = data[i + 1].split(',')[1];
        var state = data[i + 1].split(',')[3];
        // en effet malgrès ce qui est dit, le fichier csv contient des données
        // d'autres etats que washington, ce qui est inutile pour le graphique.
        if (state == "WA") {
            C5++;
            if (year >= 2014 && year <= 2023) {
                vehicule_par_date[2023 - parseInt(year)] += 1;
            }
            // comptons le nombre de vehicule hybride et non hybride
            if (Part_Hybdride == "Battery Electric Vehicle (BEV)") {
                NonHybride++;
            }
            else {
                Hybride++;
            }




            if (!marque.includes(Mark)) {
                marque[C1] = Mark;
                C1++;
            }
            // on chope l'indice de l'element et on incremente de 1 la liste vehicule_par_marque
            // a l'indice pris
            var u = marque.indexOf(Mark)
            nb_vehicule_par_marque[u]++;

            // on va maintenant calculer les données pour les fournisseurs d'accessoires
            if (!Fournisseur.includes(fournisseur)) {
                Fournisseur[C3] = fournisseur;
                C3++;
            }
            var v = Fournisseur.indexOf(fournisseur)
            part_des_fournisseurs[v]++;


            // on va s'occuper de faire l'autonomie moyenne, pour cela
            // on va faire la moyenne des autonomies differentes de 0

            // nombre d'autonomie differentes de 0
            var autonomie = parseInt(Range);
            var aux = 0;
            if (autonomie != 0 && !isNaN(autonomie)) {
                autonomie_moyenne += autonomie;
                C2++;
            }

            // nous allons maintenant compté le nombre de vehicule par compté avec la meme méthode
            if (!compté.includes(compté_washington)) {
                compté[C4] = compté_washington;
                C4++;
            }
            var w = compté.indexOf(compté_washington)
            nb_vehicule_par_compté[w]++;
        }
    }
    autonomie_moyenne = ((autonomie_moyenne * 1.60934) / C5); // pour l'avoir en km'
    // on va maintenant transformer le tableau nb_vehicule en 
    // pourcentage


    for (var i = 0; i < nb_vehicule_par_marque.length; i++) {
        nb_vehicule_par_marque[i] = (nb_vehicule_par_marque[i] * 100 / C5);
    }
    // on va aussi mettre la part des fournisseurs en pourcentage

    for (var i = 0; i < part_des_fournisseurs.length; i++) {
        part_des_fournisseurs[i] = (part_des_fournisseurs[i] * 100 / C5);
    }
    // seule l'indice 0,1,2 et 6 sont pertinants, les autres fournisseurs sont
    // très minoritaires

    var Fournisseur2 = [];
    Fournisseur2[0] = Fournisseur[0];
    Fournisseur2[1] = Fournisseur[1];
    Fournisseur2[2] = Fournisseur[2];
    Fournisseur2[3] = Fournisseur[6];
    Fournisseur2[4] = "Autres";

    Fournisseur = Fournisseur2;
    var part_des_fournisseurs2 = [];
    part_des_fournisseurs2[0] = part_des_fournisseurs[0];
    part_des_fournisseurs2[1] = part_des_fournisseurs[1];
    part_des_fournisseurs2[2] = part_des_fournisseurs[2];
    part_des_fournisseurs2[3] = part_des_fournisseurs[6];
    // calculons la somme
    var som = 0;
    for (var i = 0; i < 4; i++) {
        som += part_des_fournisseurs2[i];
    }
    part_des_fournisseurs2[4] = 100 - som; //part des autres
    part_des_fournisseurs = part_des_fournisseurs2;

    Repartition_vehicule_année(années, vehicule_par_date);
    graphiqueAutonomieMoyenne(autonomie_moyenne);
    part_Hybride_Non_Hybride(Hybride, NonHybride);
    graphiquePartFournisseurs(Fournisseur, part_des_fournisseurs);
    Part_marche_marque(marque, nb_vehicule_par_marque);


    // certains etats n'affiche rien, nous n'avons si nous utilisons juste les noms des comptés
    // nous avons donc choisit d'utiliser plutot les codes unique des comptés FIPS
    let countyFIPS = {
        'Adams': '53001',
        'Asotin': '53003',
        'Benton': '53005',
        'Chelan': '53007',
        'Clallam': '53009',
        'Clark': '53011',
        'Columbia': '53013',
        'Cowlitz': '53015',
        'Douglas': '53017',
        'Ferry': '53019',
        'Franklin': '53021',
        'Garfield': '53023',
        'Grant': '53025',
        'Grays Harbor': '53027',
        'Island': '53029',
        'Jefferson': '53031',
        'King': '53033',
        'Kitsap': '53035',
        'Kittitas': '53037',
        'Klickitat': '53039',
        'Lewis': '53041',
        'Lincoln': '53043',
        'Mason': '53045',
        'Okanogan': '53047',
        'Pacific': '53049',
        'Pend Oreille': '53051',
        'Pierce': '53053',
        'San Juan': '53055',
        'Skagit': '53057',
        'Skamania': '53059',
        'Snohomish': '53061',
        'Spokane': '53063',
        'Stevens': '53065',
        'Thurston': '53067',
        'Wahkiakum': '53069',
        'Walla Walla': '53071',
        'Whatcom': '53073',
        'Whitman': '53075',
        'Yakima': '53077'
    }; // crée avec une intelligence artificielle generative

    let countiesFIPS = compté.map(county => countyFIPS[county]);
    Carte(compté, countiesFIPS, nb_vehicule_par_compté, geojson_url);


}
fileInput.addEventListener('change', readFile);











