
var canvas = document.getElementById("screen");
var gfx = canvas.getContext("2d");
// définition du constructeur du type Piece
var Piece = function (name, color, line, column) {
    this.name = name || 'empty'; // si il n'y a pas de paramètre 'name', utiliser 'empty' 
    this.line = line || 0;
    this.column = column || 0;
    this.color = color || 'grey';
    this.moves = [[0, 1]];
    this.pieceId = undefined;
    this.hasBeenMoved = false;
};
// définition d'une méthode du type Piece: il est crucial de la créer 
// au niveau du prototype et non pas de l'objet !
// Cette fonction sera pratique pour calculer le déplacement des pièces
// quelle que soit leur orientation
Piece.prototype.orientation = function () {
    return (this.color === 'white') ? +1 : -1;
};
Piece.prototype.draw = function () {
    var pos;
    if (this.color === "white") {
        pos = this.pieceId[0];
    } else {
        pos = this.pieceId[1];
    }

    var coords = convertCoordToPix(this.column, this.line);
    gfx.drawImage(chessSymbols, pos[0], pos[1], 75, 75, coords[0], coords[1], 45, 45);
};
Piece.prototype.getMoves = function () {
    return this.moves;
};
// Constructeur du type Pawn, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Pawn = function (color, line, column) {
    Piece.prototype.constructor.call(this, 'Pawn', color, line, column);
    this.pieceId = [[0, 5], [480, 0]];
    this.moves = [[0, 1]];
};
Pawn.prototype = new Piece();
/**
 * All pieces
 */
var King = function (color, line, column) {
    Piece.prototype.constructor.call(this, 'King', color, line, column);
    this.pieceId = [[320, 0], [800, 0]];
};
King.prototype = new Piece();
var Queen = function (color, line, column) {
    Piece.prototype.constructor.call(this, 'Queen', color, line, column);
    this.pieceId = [[400, 0], [880, 0]];
};
Queen.prototype = new Piece();
var Rook = function (color, line, column) {
    Piece.prototype.constructor.call(this, 'Rook', color, line, column);
    this.pieceId = [[240, 0], [720, 0]];
};
Rook.prototype = new Piece();
var Bishop = function (color, line, column) {
    Piece.prototype.constructor.call(this, 'Bishop', color, line, column);
    this.pieceId = [[160, 0], [640, 0]];
};
Bishop.prototype = new Piece();
var Knight = function (color, line, column) {
    Piece.prototype.constructor.call(this, 'Knight', color, line, column);
    this.pieceId = [[85, 0], [560, 0]];
};
Knight.prototype = new Piece();
var createBoard = function (nbLine, nbColumn) { // avec des pieces vide}
    var tab = [];
    for (var l = 0; l < nbLine; l++) {
        var line = [];
        for (var c = 0; c < nbColumn; c++) {
            line.push(null);
        }

        tab.push(line);
    }

    return tab;
};
var isEmpty = function (lig, col) {
    return board[lig][col] === null;
};
var put = function (lig, col, piece) {
    board[lig][col] = piece;
};
// 

var board = createBoard(8, 8);
// Fonction d'initialisation de plateau
var initBoard = function () {

    // creation pions rangee blanche
    var line = 1;
    for (var n = 0; n < board[line].length; n++) {
        put(line, n, new Pawn("white", line, n));
    }
    line = 0;
    put(line, 0, new Rook("white", line, 0));
    put(line, 1, new Knight("white", line, 1));
    put(line, 2, new Bishop("white", line, 2));
    put(line, 3, new King("white", line, 3));
    put(line, 4, new Queen("white", line, 4));
    put(line, 5, new Bishop("white", line, 5));
    put(line, 6, new Knight("white", line, 6));
    put(line, 7, new Rook("white", line, 7));
    /**
     * PIONS NOIRS
     */
    line = 6;
    for (var n = 0; n < board[line].length; n++) {
        put(line, n, new Pawn("black", line, n));
    }

    line = 7;
    put(line, 0, new Rook("black", line, 0));
    put(line, 1, new Knight("black", line, 1));
    put(line, 2, new Bishop("black", line, 2));
    put(line, 3, new King("black", line, 3));
    put(line, 4, new Queen("black", line, 4));
    put(line, 5, new Bishop("black", line, 5));
    put(line, 6, new Knight("black", line, 6));
    put(line, 7, new Rook("black", line, 7));
};
// Converts 
var convertCoordinates = function (ligPixel, colPixel) {
    var lig = Math.ceil(ligPixel / (canvas.height / 8)) - 1;
    var col = Math.ceil(colPixel / (canvas.width / 8)) - 1;
    return [col, lig];
};
function convertCoordToPix(lig, col) {
    var ligX = Math.ceil((canvas.height / 8)) * lig;
    var colY = Math.ceil((canvas.width / 8)) * col;
    return [ligX, colY];
}
;
var highlightedCells = [];
var toDeplace = [];
/**
 * Draws a cell
 * @param {type} coord
 * @returns {undefined}
 */
var drawCell = function (coord) {
    var l = coord[1];
    var c = coord[0];
    // draw background color
    gfx.fillStyle = ((l + c) % 2 === 0 ? "#C2C3C3" : "#E6E8E7");
    gfx.lineWidth = 1;
    gfx.fillRect(c * wLig, l * hLig, 75, 75);
    // on dessine la piece
    if (board[l][c] === null) {
        gfx.strokeStyle = "#000000";
        gfx.lineWidth = 1;
        // Check if is highligted
        if (caseHighlighted(c, l) === true) {
            gfx.strokeStyle = "#FF0000";
            gfx.lineWidth = 3;
            console.log("HIGHLIGHT " + c + "-" + l);
        }

        gfx.strokeRect(c * wLig + 15, l * hLig + 15, 20, 20);
    } else if (board[l][c] !== null) {
        board[l][c].draw();
    }
};
var caseHighlighted = function (x, y) {
    for (var y2 = 0, l2 = highlightedCells.length; y2 < l2; y2++) {
        var m = highlightedCells[y2];
        if (m[0] === x && m[1] === y) {
            return true;
        }
    }
    return false;
};
var currentTurn = "white";

canvas.addEventListener("mousedown", mouseClicked, false);
function mouseClicked(event) {
    var ligCoord = event.pageY - canvas.offsetTop;
    var colCoord = event.pageX - canvas.offsetLeft;
    var coord = convertCoordinates(ligCoord, colCoord);
    var piece = board[coord[1]][coord[0]];
    
    // piecee
    if (piece !== null) {
        // not color to play!
        if(piece.color !== currentTurn){
            return;
        } 

        if (highlightedCells.length > 0) {
            highlightedCells = [];
        }

        var moves = piece.getMoves();
        var orien = piece.orientation();
        for (var i = 0, l = moves.length; i < l; i++) {
            var move = moves[i];
            highlightedCells.push([
                coord[0] + orien * move[0], //x
                coord[1] + orien * move[1] // y
            ]);
        }

        toDeplace = [coord[0], coord[1]];

    } else if (caseHighlighted(coord[0], coord[1]) === true && board[coord[1]][coord[0]] === null) {
        // deplace pawn
        piece = board[toDeplace[1]][toDeplace[0]];
        piece.line = coord[1];
        piece.column = coord[0];
        
        // switch case
        board[coord[1]][coord[0]] = board[toDeplace[1]][toDeplace[0]];
        board[toDeplace[1]][toDeplace[0]] = null;
        
        // change turn
        currentTurn = (currentTurn === "white") ? "black" : "white";
        document.getElementById('turn').textContent = currentTurn  +" plays!";
    }

    // render
    renderBoard();
}

var hLig = Math.ceil(canvas.height / 8);
var wLig = Math.ceil(canvas.width / 8);
var renderBoard = function () {
    for (var l = 0; l < board.length; l++) {
        for (var c = 0; c < board[l].length; c++) {
            drawCell([c, l]);
        }
    }
};
var chessSymbols = new Image();
chessSymbols.src = 'chess.png';
chessSymbols.onload = function () {
    console.info("Chess symbols loaded !\nLoading game...");
    // init
    initBoard();
    renderBoard();
};


