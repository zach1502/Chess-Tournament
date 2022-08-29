var transpositionTable = {}; // prevents recalculating the same positions
var positionCount = 0; // keep track of how many positions are evaluated
var isOutOfBook = false; // false = use book, true = don't use book
var isEndGame = false; // for endgame specific evaluation

// Feature set:
// 1. Piece square tables
// 2. Piece mobility
// 3. Transposition table*
// 4. quicience search
// 5a. futility pruning
// 5b. deep futility pruning
// 5c. razoring
// 6. move ordering*
// 7. opening book
// 8. Material table*

// * = only speeds up search, no effect on play strength

function worstfishAlgorithm (chess, turn, alpha, beta, maxDepth){
    positionCount++;

    // don't recalculate the same position
    if (chess.fen() in transpositionTable){
        return transpositionTable[chess.fen()];
    }

    if (chess.game_over()){
        // checkmate
        if(chess.in_checkmate()){
            return (turn) ? -10000 : 10000;
        }
    }

    if (maxDepth === 0){
        // if (chess.in_check()){

        //     moves = getChecksAndCaptures(chess.moves());
        //     tempChess = new Chess(chess.fen());
        //     var score = quietSearch(moves, tempChess, alpha, beta, 2); // limited search, try to get to a stable position and evaluate accordingly
        //     return -score;
        // }
        return -evaluatePosition(chess);
    }

    var moves = chess.moves();

    // special behaviors
    if (maxDepth === 1){
        moves =  futilityPruning(moves, chess, alpha, 300); // weak pruning > 300, strong pruning < 300
        // only uncomment this when initial maxDepth is deeper than like 5
        // else if (maxDepth === 2){
        //     moves = futilityPruning(moves, chess, alpha, 600);
        // }
        // else if (maxDepth === 3){
        //     moves = futilityPruning(moves, chess, alpha, 900);
        // }
    }
    else {
        moves =  moveSort(moves, chess);
    }

    // as white
    if(turn){
        var bestMove = -9999;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            bestMove = Math.max(bestMove,  worstfishAlgorithm(chess, !turn, alpha, beta, maxDepth - 1));
            chess.undo();
            transpositionTable[chess.fen()] = bestMove;

            alpha = Math.max(alpha, bestMove);

            if(beta <= alpha){
                return bestMove;
            }
        }

        return bestMove;
    }
    // as black
    else{
        var bestMove = 9999;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            bestMove = Math.min(bestMove,  worstfishAlgorithm(chess, !turn, alpha, beta, maxDepth - 1));
            chess.undo();

            transpositionTable[chess.fen()] = bestMove;
            beta = Math.min(beta, bestMove);

            if(beta <= alpha){
                transpositionTable[chess.fen()] = alpha
                return bestMove;
            }
        }

        return bestMove;
    }
}

function worstfishAI(chess, turn, maxDepth){
    // this AI uses minimax to find the best move.

    positionCount = 0;

    // use the opening book
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
    var bestMove;
    var moveScore = 0;

    // organize the moves by checks then captures then the rest.
    moves =  moveSort(moves, chess);

    if(!turn){
        var evaluation = 99999;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            moveScore =  worstfishAlgorithm(chess, turn, -99999, 99999, maxDepth-1, turn);
            chess.undo();

            //console.log(moves[i] + ": " + moveScore);

            if(moveScore <= evaluation){
                evaluation = moveScore;
                bestMove = moves[i];

                if(moveScore == 10000){ // found forced mate
                    break;
                }
            }
        }
    }
    else{
        var evaluation = -99999;
        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            moveScore =  worstfishAlgorithm(chess, turn, -99999, 99999, maxDepth-1, turn);
            chess.undo();

            //console.log(moves[i] + ": " + moveScore);

            if(moveScore > evaluation){
                evaluation = moveScore;
                bestMove = moves[i];

                if(moveScore == -10000){
                    break;
                }
            }
        }
    }

    //console.log("Chose this move: " + bestMove + ": " + evaluation);
    chess.move(bestMove);

    //console.log("Position count: " + positionCount);

    // number of entries in the hash table
    //console.log("Hash table size: " + Object.keys(transpositionTable).length);

    transpositionTable = {};
}