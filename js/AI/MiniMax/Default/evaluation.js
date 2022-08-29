function buildMaterialTable(){
    // 
    // P = white pawn, p = black pawn
                        //P, p ,N, n, B, b ,R, r ,Q, q
                        //9* 9* 3* 3* 3* 3* 3* 3* 3* 3
    var table = new Array(531441); // ignoring the possibility of promoting to B, N, R. Rare enough that I won't bother until I have to. also assuming a max of 3 queens
                                   // 2 queens would be enough but I wouldn't mind greater coverage. The table will get a hit 99.999% of the time.

    for(var wPawn = 0; wPawn < 9; wPawn++){
        for(var bPawn = 0; bPawn < 9; bPawn++){
            for(var wKnight = 0; wKnight < 3; wKnight++){
                for(var bKnight = 0; bKnight < 3; bKnight++){
                    for(var wBishop = 0; wBishop < 3; wBishop++){
                        for(var bBishop = 0; bBishop < 3; bBishop++){
                            for(var wRook = 0; wRook < 3; wRook++){
                                for(var bRook = 0; bRook < 3; bRook++){
                                    for(var wQueen = 0; wQueen < 3; wQueen++){
                                        for(var bQueen = 0; bQueen < 3; bQueen++){
                                            var index = wPawn   * 59049 + //* 9 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 + 
                                                        bPawn   * 6561  + //* 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 +
                                                        wKnight * 2187  + //* 3 * 3 * 3 * 3 * 3 * 3 * 3 +
                                                        bKnight * 729   + //* 3 * 3 * 3 * 3 * 3 * 3 + 
                                                        wBishop * 243   + //* 3 * 3 * 3 * 3 * 3 + 
                                                        bBishop * 81    + //* 3 * 3 * 3 * 3 + 
                                                        wRook   * 27    + //* 3 * 3 * 3 + 
                                                        bRook   * 9     + //* 3 * 3 +
                                                        wQueen  * 3     + //* 3 +
                                                        bQueen;

                                            table[index] = (wPawn - bPawn) * pieceEval.p +
                                                           (wKnight - bKnight) * pieceEval.n +
                                                           (wBishop - bBishop) * pieceEval.b +
                                                           (wRook - bRook) * pieceEval.r +
                                                           (wQueen - bQueen) * pieceEval.q;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(table);

    return table;
}


function positioningEval(chess, squareNumber, piece){
    if(piece === null){
        return 0;
    }

    var numMoves = chess.moves({square: piece.square}).length;
    
    // Positioning + mobility bonus
    var getAbsEval = function(){
        switch (piece.type) {
            case 'p':
                return (piece.color === 'w' ? whitePawnTable[squareNumber] : blackPawnTable[squareNumber]);
            case 'n':
                return (piece.color === 'w' ? whiteKnightTable[squareNumber] : blackKnightTable[squareNumber]) + (numMoves >> 2 - 8);
            case 'b':
                return (piece.color === 'w' ? whiteBishopTable[squareNumber] : blackBishopTable[squareNumber]) + (numMoves >> 2 - 16);
            case 'r':
                return (piece.color === 'w' ? whiteRookTable[squareNumber] : blackRookTable[squareNumber]) + (numMoves >> 4 - 32);
            case 'q':
                return (piece.color === 'w' ? whiteQueenTable[squareNumber] : blackQueenTable[squareNumber]) + (numMoves - 4);
            case 'k':
                if(isEndGame){
                    return (piece.color === 'w' ? whiteKingTableEndGame[squareNumber] : blackKingTableEndGame[squareNumber]);
                }
                return (piece.color === 'w' ? whiteKingTable[squareNumber] : blackKingTable[squareNumber]) + (numMoves >> 2 - 4);
            default:
                raise ("Invalid piece type");
                break;
        }
    }

    var absEval = getAbsEval();
    return (piece.color === 'w' ? absEval : -absEval);
}

function countRemainingPieces() {
    return wPieces.p * 59049 + 
    bPieces.p * 6561  +
    wPieces.n * 2187  +
    bPieces.n * 729   +
    wPieces.b * 243   +
    bPieces.b * 81    +
    wPieces.r * 27    +
    bPieces.r * 9     +
    wPieces.q * 3     +
    bPieces.q;
}

// simple evaluation function
function evaluatePosition(chess){
    var index = countRemainingPieces();
    var score = materialTable[index];
    const board = chess.board();

    // manually count material
    if (isNaN(score)){
        score = 0;
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                square = (chess.board())[i][j];
                if(square === null) continue;

                if (square.type === 'p') {
                    score += pieceEval.p;
                } else if (square.type === 'r') {
                    score += pieceEval.r;
                } else if (square.type === 'n') {
                    score += pieceEval.n;
                } else if (square.type === 'b') {
                    score += pieceEval.b;
                } else if (square.type === 'q') {
                    score += pieceEval.q;
                } else if (square.type === 'k') {
                    score += pieceEval.k;
                }
            }
        }
    }

    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){
            score += positioningEval(chess, (i << 3) + j, board[i][j]);
        }
    }

    return score;
}

// in centipawns * 2
var pieceEval = {
    p: 200,
    b: 840,
    n: 810,
    r: 1270,
    q: 2525,
    k: Infinity
};

// piece-square tables, nudge the AI to position better
// King favors to castle Kingside so pawns will love to move on the queen side
var whitePawnTable = [
    30.0,  50.0,  50.0,  50.0, 50.0, 50.0, 50.0, 30.0,
    10.0,  15.5,  15.5,  15.5, 15.5, 15.5, 15.5, 15.0,
    0.5,  0.5,  0.5,  0.5, 0.5, 0.5, 0.0, 0.5,
    0.0,  0.0,  0.0,  0.2, 0.2, 0.0, 0.0, 0.0,
    0.1,  0.15, 0.25, 3.5, 3.5, 0.0, 0.0, 0.5,
    0.15, 0.1,  0.1,  0.5, 0.5, 0.0, 0.2, 0.1,
    0.05, 0.05, -0.05,-0.1,-0.1,-15, 0.05, 0.05,
    0.0,  0.0,  0.0,  0.0, 0.0, 0.0, 0.0, 0.0
];

var whiteKnightTable = [
    -0.5, -0.3, -0.3, -0.3, -0.3, -0.3, -0.3, -0.5,
    -0.3, -0.3,  0.0,  0.0,  0.0,  0.0, -0.3, -0.3,
    -0.3,  0.0,  0.1,  0.0,  0.0,  0.1,  0.0, -0.3,
    -0.3,  0.0,  1.2,  0.1,  0.1,  1.2,  0.0, -0.3,
    -0.3,  0.0,  1.2,  0.2,  0.2,  1.2,  0.0, -0.3,
    -0.3,  0.0,  0.1,  0.15, 0.15, 0.1,  0.0, -0.3,
    -0.3, -0.3,  0.0,  0.1,  0.1,  0.0, -0.3, -0.3,
    -0.5, -0.3, -0.3, -0.3, -0.3, -0.3, -0.3, -0.5
];

var whiteBishopTable = [
    -0.5, -0.3, -0.3, -0.3, -0.3, -0.3, -0.3, -0.5,
    -0.3, -0.3,  0.0,  0.0,  0.0,  0.0, -0.3, -0.3,
    -0.3,  0.0,  0.1,  0.0,  0.0,  0.1,  0.0, -0.3,
    -0.3,  0.1,  0.1,  0.1,  0.1,  0.1,  0.1, -0.3,
    -0.3,  0.0,  0.2,  0.1,  0.1,  0.2,  0.0, -0.3,
    -0.3,  0.0,  0.1,  0.1,  0.5,  0.1,  0.0, -0.3,
    -0.3,  0.15, 0.5,  0.5,  0.5,  0.5,  0.15,-0.3,
    -0.5, -0.3, -0.3, -0.3, -0.3, -0.3, -0.3, -0.5
];

var whiteRookTable = [
    0.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.1,  0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    0.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.05,  0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, // yea nah, not gonna align this
    0.0,  -0.5, -0.5, 0.1, 0.1, 0.5, -0.5, 0.0
];

var whiteQueenTable = [
    -0.3,-0.2,-0.2,-0.2,-0.2,-0.2,-0.2, -0.3,
    -0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.2,
    -0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.2,
    -0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.2,
    -0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.2,
    -0.2, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -0.2,
    -0.2, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, -0.2,
    -0.3,-0.2,-0.2,-0.2,-0.2,-0.2,-0.2, -0.3
];

var whiteKingTable = [
    -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,
    -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,
    -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,
    -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,
    -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,  -0.2,
    -0.1,  -0.1,  -0.1,  -0.1,  -0.1,  -0.1,  -0.1,  -0.1,
    0.0 ,  -5.0,  -5.0,  -5.0,  -5.0,  -5.0,  -5.0,   0.0,
    0.1 ,   0.2,   0.2,  -2.0,  -0.5,  -2.5,   0.3,   0.1
]

var whiteKingTableEndGame = [
    8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0,
    8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 2.0, 8.0,
    8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0,
    8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0,
    6.0, 6.0, 6.0, 7.0, 7.0, 6.0, 6.0, 6.0,
    4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0,
    2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0,
    -5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0
]

var blackPawnTable = reverseArray(whitePawnTable);
var blackKnightTable = reverseArray(whiteKnightTable);
var blackBishopTable = reverseArray(whiteBishopTable);
var blackRookTable = reverseArray(whiteRookTable);
var blackQueenTable = reverseArray(whiteQueenTable);
var blackKingTable = reverseArray(whiteKingTable);
var blackKingTableEndGame = reverseArray(whiteKingTableEndGame);

var whiteAttackingSquares = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
];

var blackAttackingSquares = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
];