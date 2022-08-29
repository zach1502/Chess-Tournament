var transpositionTable = {}; // prevents recalculating the same positions
var positionCount = 0; // keep track of how many positions are evaluated
var isOutOfBook = false; // false = use book, true = don't use book
var isEndGame = false; // for endgame specific evaluation
var futilityAllowed = true; // Futility Pruning
var deepFutilityPruningAllowed = false; 
var superDeepFutilityPruningAllowed = false;
var quietSearchAllowed = false; // Quicience Search

// Feature set:
// 1. Piece square tables
// 2. Piece mobility
// 3. Transposition table*
// 4. Quicience search
// 5. Futility pruning
// 6. Simple Move ordering*
// 7. opening book
// 8. Material table*

// * = only speeds up search, no effect on play strength

function minimaxAlgorithm (chess, turn, alpha, beta, maxDepth){
    positionCount++;

    // don't recalculate the same position
    if (chess.fen() in transpositionTable){
        return transpositionTable[chess.fen()];
    }

    if (chess.game_over()){
        // checkmate
        if(chess.in_checkmate()){
            return (turn) ? -Infinity : Infinity;
        }
    }

    if (maxDepth === 0){
        if (chess.in_check() && quietSearchAllowed){

            moves = getChecksAndCaptures(chess.moves());
            tempChess = new Chess(chess.fen());
            var score = quietSearch(moves, tempChess, alpha, beta, 2); // limited search, try to get to a stable position and evaluate accordingly
            return -score;
        }
        return -evaluatePosition(chess);
    }

    var moves = chess.moves();

    // special behaviors
    if (maxDepth === 1 && futilityAllowed){
        moves =  futilityPruning(moves, chess, alpha, pieceEval.b); // stronger prune < pieceEval.b < weaker prune
    }
    // Enabling below may lead to decreased performance
    else if (maxDepth === 2 && deepFutilityPruningAllowed){
        moves = futilityPruning(moves, chess, alpha, pieceEval.b >> 1);
    }
    else if (maxDepth === 3 && superDeepFutilityPruningAllowed){
        moves = futilityPruning(moves, chess, alpha, pieceEval.b >> 2);
    }
    else {
        moves =  moveSort(moves, chess);
    }

    // as white
    if(turn){
        var bestMove = -Infinity;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            bestMove = Math.max(bestMove,  minimaxAlgorithm(chess, !turn, alpha, beta, maxDepth - 1));
            chess.undo();
            transpositionTable[chess.fen()] = bestMove;

            alpha = Math.max(alpha, bestMove);


            if(beta <= alpha){
                transpositionTable[chess.fen()] = alpha;
                return bestMove;
            }
        }

        return bestMove;
    }
    // as black
    else{
        var bestMove = Infinity;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            bestMove = Math.min(bestMove,  minimaxAlgorithm(chess, !turn, alpha, beta, maxDepth - 1));
            chess.undo();

            transpositionTable[chess.fen()] = bestMove;
            beta = Math.min(beta, bestMove);


            if(beta <= alpha){
                transpositionTable[chess.fen()] = alpha;
                return bestMove;
            }
        }

        return bestMove;
    }
}

function minimaxAI(chess, turn, maxDepth, enableFutility = true, enableDeepFutility = false, enableSuperDeepFutility = false, enableQuietSearch = false){
    // this AI uses minimax to find the best move.
    futilityAllowed = enableFutility;
    deepFutilityPruningAllowed = enableDeepFutility;
    superDeepFutilityPruningAllowed = enableSuperDeepFutility;
    quietSearchAllowed = enableQuietSearch;

    positionCount = 0;

    // use the opening book
    //console.log("isOutOfBook: " + isOutOfBook);
    if (!isOutOfBook){
        var possibleMoves = openingBook[chess.fen()];
        if (possibleMoves !== undefined){
            // pick a random move from the possible moves
            var openingLine = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            chess.move(openingLine);
            return;
        }
        isOutOfBook = true;
    }

    // get all moves
    var moves = chess.moves();

    // not many root moves = very fast, take advantage of it.
    if (moves.length < 15) maxDepth++;

    // not many pieces = not as many moves down the line and thus easier to calculate. like comparing 2^n vs 5^n
    // enable endgame eval when no queens on the board
    if (wPieces.p + wPieces.n + wPieces.b + wPieces.r + wPieces.q + wPieces.k + bPieces.p + bPieces.n + bPieces.b + bPieces.r + bPieces.q + bPieces.k < 10) maxDepth++;
    if (wPieces.p + wPieces.n + wPieces.b + wPieces.r + wPieces.q + wPieces.k + bPieces.p + bPieces.n + bPieces.b + bPieces.r + bPieces.q + bPieces.k < 6) {isEndGame = true; maxDepth++;}
    if (wPieces.p + wPieces.n + wPieces.b + wPieces.r + wPieces.q + wPieces.k + bPieces.p + bPieces.n + bPieces.b + bPieces.r + bPieces.q + bPieces.k < 4) maxDepth++;
    if (wPieces.b === 0 && bPieces.q === 0 && bPieces.r === 0 && bPieces.b === 0) maxDepth++;


    console.log("maxDepth: " + maxDepth);

    var bestMove;
    var moveScore = 0;

    // organize the moves by checks then captures then the rest.
    moves =  moveSort(moves, chess);

    if(!turn){
        var evaluation = -Infinity;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            moveScore =  minimaxAlgorithm(chess, turn, -Infinity, Infinity, maxDepth-1, turn);
            chess.undo();

            if(moveScore >= evaluation){
                evaluation = moveScore;
                bestMove = moves[i];

                if(moveScore == Infinity){ // found forced mate
                    break;
                }
            }
        }
    }
    else{
        var evaluation = Infinity;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            moveScore =  minimaxAlgorithm(chess, turn, -Infinity, Infinity, maxDepth-1, turn);
            chess.undo();

            if(moveScore < evaluation){
                evaluation = moveScore;
                bestMove = moves[i];

                if(moveScore == -Infinity){
                    break;
                }
            }
        }
    }

    // console.log("Chose this move: " + bestMove + ": " + evaluation);
    chess.move(bestMove);

    // console.log("Position count: " + positionCount);

    // number of entries in the hash table
    // console.log("Hash table size: " + Object.keys(transpositionTable).length);

    transpositionTable = {};
    return bestMove;
}

// needs some work
// idea is simple, don't stop searching if you're in check. Things can change easily.
// if at depth == 0 & in check, extend by 1 more depth and do a more limited search.
// I think this doesn't work well. because the engine isn't going deep enough.
function quietSearch(moves, chess, alpha, beta, maxQuietDepth){
    var staticEval = evaluatePosition(chess);
    var currentPosFen = chess.fen();
    if (staticEval >= beta){
        transpositionTable[currentPosFen] = beta;
        return beta;
    }
    if (staticEval > alpha){
        alpha = staticEval;
    }
    if (maxQuietDepth === 0){
        transpositionTable[currentPosFen] = alpha;
        return alpha;
    }

    for (var i = 0; i < moves.length; i++){
        chess.move(moves[i]);
        var searchingPosFen = chess.fen();
        // use transposition table if needed
        var score = (searchingPosFen in transpositionTable) ? transpositionTable[searchingPosFen] : quietSearch(chess.moves(), chess, alpha, beta, maxQuietDepth - 1);

        chess.undo();
        
        var delta = pieceEval.r;
        if(score >= beta){
            transpositionTable[searchingPosFen] = beta;
            return beta;
        }
        // delta prune
        // prune if it will likely not be better than the current alpha
        if(score < alpha - delta){
            transpositionTable[searchingPosFen] = alpha;
            return alpha;
        }
        if(score > alpha){
            alpha = score;
        }
    }

    transpositionTable[currentPosFen] = alpha;
    return alpha;
}

function moveSort(moves, chess){

    // move sorting
    var checksAndCaptures = [];
    var checks = [];
    var captures = [];
    var regularMoves = [];
    var isInCheck = false;
    var isCaptured = false;

    for(var i = 0; i < moves.length; i++){
        chess.move(moves[i]);
        if(chess.in_check()){
            isInCheck = true;
        }
        chess.undo();

        if(moves[i].charAt(moves[i].length - 1) === '+'){
            isInCheck = true;
        }

        if (moves[i].includes("x")){
            isCaptured = true;
        }

        if (isInCheck && isCaptured){
            checksAndCaptures.push(moves[i]);
            isInCheck = false;
            isCaptured = false;
            continue;
        }

        if (isInCheck){
            checks.push(moves[i]);
            isInCheck = false;
            continue;
        }

        if (isCaptured){
            captures.push(moves[i]);
            isCaptured = false;
            continue;
        }

        // if it's not a check or capture, it's a normal move.
        regularMoves.push(moves[i]);
    }


    return checksAndCaptures.concat(checks).concat(captures).concat(regularMoves);
}

function futilityPruning(moves, chess, alpha, margin){
    // move sorting
    var checksAndCaptures = [];
    var checks = [];
    var captures = [];
    var regularMoves = [];
    var isInCheck = false;
    var isCaptured = false;

    for(var i = 0; i < moves.length; i++){
        if(moves[i].charAt(moves[i].length - 1) === '+'){
            isInCheck = true;
        }

        if (moves[i].includes("x")){
            isCaptured = true;
        }

        if (isInCheck && isCaptured){
            checksAndCaptures.push(moves[i]);
            isInCheck = false;
            isCaptured = false;
            continue;
        }

        if (isInCheck){
            checks.push(moves[i]);
            isInCheck = false;
            continue;
        }

        if (isCaptured){
            captures.push(moves[i]);
            isCaptured = false;
            continue;
        }

        // do some guess work on the score of the move.
        var staticEval = evaluatePosition(chess);

        if (staticEval + margin >= alpha){
            regularMoves.push(moves[i]);
        }
    }

    return checksAndCaptures.concat(checks).concat(captures).concat(regularMoves);
}

function getChecksAndCaptures(moves){
    // just check if the last character of a move is a +
    var checkingMoves = [];
    for (var i = 0; i < moves.length; i++){
        if (moves[i].charAt(moves[i].length - 1) == "+" || moves[i].includes("x")){
            checkingMoves.push(moves[i]);
        }
    }

    return checkingMoves;
}

var reverseArray = function(array) {
    return array.slice().reverse();
};
