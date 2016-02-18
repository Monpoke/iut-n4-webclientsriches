$(function () {
    // Dessin du graphique de la semaine actuelle.
    var ctx;
    var canvas;
    var x, y;
    var l, c;
    canvas = document.getElementById('canvas');
    if (typeof canvas === 'undefined') {
        console.log("Error canvas...");
        return;
    }

    ctx = canvas.getContext("2d");
    var data = $.parseJSON(jsonData);
    ctx.font = "10px Verdana";
    ctx.fillStyle = "#000000";

    // DEBUT FIN D'EDT
    var debut = new Date(2015, 10, 01);
    debut.setHours(0);
    var fin = new Date(2015, 10, 8);
    
    
    fin.setHours(0);

    var day = (60 * 60 * 24);



    /*
     * START HOUR
     */
    var heureDebutEDT = 8;
    var heureFinEDT = 20;

    var r = (fin.getTime() - debut.getTime()) / 1000;
    var nbLines = (r) / day;

    var heightLine = canvas.height / nbLines;
    var widthLine = canvas.width;
    // one hour = x PX?
    var oneHourWidth = widthLine / (heureFinEDT - heureDebutEDT);


    $.each(data, function (key, value) {
        // on calcule la ligne du 19 au 24 octobre
        var split = value.dateSeance.split("-");
        var heure = value.heureSeance.substring(0, 2);
        var minute = value.heureSeance.substring(2, 2);
        var date = new Date(split[0], split[1], split[2], heure, minute);

        if (debut.getTime() > date.getTime() || date.getTime() > fin.getTime()) {
            return;
        }

        var startDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), heureDebutEDT, 0);


        // id ligne

        var id = Math.floor((date.getTime() - debut.getTime()) / 1000 / day);
        //   console.log(value[0]);
        // console.log(date +" -> " + id);

        var duree = value.dureeSeance / 100;
        var dureeHeure = parseInt(duree), dureeMinute = (duree - dureeHeure) * 60;

        var width = duree * oneHourWidth;
        var decalX = ((date.getTime() - startDay.getTime()) / 1000) / (60 * 60);
        decalX *= oneHourWidth;

        // on calcule la position y
        var y = heightLine * id;
        var x = decalX;

        ctx.fillStyle = getRandomColor();
        ctx.fillRect(x, y, width, heightLine);

        // cours
        ctx.fillStyle = invertHex(ctx.fillStyle);
        ctx.font = "10px Verdana";
        ctx.fillText(value.Enseignement + " " + date.getHours() + "H" + date.getMinutes(), 10 + x, 15 + y);

        // prof 
        ctx.font = "8px Verdana";
        ctx.fillText(value.Prof, 10 + x, 30 + y);
        ctx.fillText(value.groupeId, 50 + x, 40 + y);
        ctx.fillText(value.Salle, 60 + x, 50 + y);

    });
    
    $("body").append("<div style='font-weight: bold; font-size: 18px;text-align:center'> Du " + debut.getDate() + "/" + debut.getMonth()+"/"+debut.getFullYear() + " au " + fin.getDate() + "/" + fin.getMonth()+"/"+fin.getFullYear()+"</div>");
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function invertHex(hexnum) {
    hexnum = hexnum.substring(1);
    if (hexnum.length != 6) {
        console.error("Hex color must be six hex numbers in length.");
        return false;
    }

    hexnum = hexnum.toUpperCase();
    var splitnum = hexnum.split("");
    var resultnum = "";
    var simplenum = "FEDCBA9876".split("");
    var complexnum = new Array();
    complexnum.A = "5";
    complexnum.B = "4";
    complexnum.C = "3";
    complexnum.D = "2";
    complexnum.E = "1";
    complexnum.F = "0";

    for (i = 0; i < 6; i++) {
        if (!isNaN(splitnum[i])) {
            resultnum += simplenum[splitnum[i]];
        } else if (complexnum[splitnum[i]]) {
            resultnum += complexnum[splitnum[i]];
        } else {
            console.error("Hex colors must only include hex numbers 0-9, and A-F");
            return false;
        }
    }

    return "#"+resultnum;
}