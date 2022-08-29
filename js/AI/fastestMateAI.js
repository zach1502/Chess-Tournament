
var principalVariation = [];
var visitedPositions = {};
function fastMateAlgorithm(chess, turn, maxDepth, initialTurn) {
    if (chess.in_checkmate() && turn !== initialTurn) {
        console.log("mate found")
        console.log(principalVariation);
        return true;
    }

    if (maxDepth < 0) {
        return false;
    }

    var moves = moveSort(chess.moves());

    for(var i = 0; i < moves.length; i++){
        chess.move(moves[i]);
        principalVariation.push(moves[i]);

        var isCheckmate = fastMateAlgorithm(chess, !turn, maxDepth - 1, initialTurn);

        chess.undo();
        principalVariation.pop();

        if (isCheckmate) {
            return true;
        }
    }

    return false;
}

function fastMateAI(chess, turn, maxDepth){
    // iterative deepening
    var depth = 0;
    var foundMate = false;
    var move = "";
    while(maxDepth > depth){
        var moves = moveSort(chess.moves());

        for(var i = 0; i < moves.length; i++){
            chess.move(moves[i]);
            visitedPositions[chess.fen()] = true;
            principalVariation.push(moves[i]);

            foundMate = fastMateAlgorithm(chess, !turn, depth - 1, turn);

            chess.undo();
            principalVariation.pop();

            if (foundMate) {
                move = moves[i];
                break;
            }
        }

        if(foundMate === true){
            break;
        }

        depth++;
    }

    if (foundMate){
        console.log("Chose this move: " + move + ": " + depth);
        chess.move(move);
    }
    else{
        // random
        chess.move(chess.moves()[Math.floor(Math.random() * moves.length)]);
    }
    return;
}

function moveSort(moves){
    var checksAndCaptures = [];
    var checks = [];
    var captures = [];
    var regularMoves = [];
    var isInCheck = false;
    var isCaptured = false;

    for(var i = 0; i < moves.length; i++){

        var move = moves[i];

        if(move.charAt(move.length - 1) === '#'){
            return [move];
        }
        
        if(move.charAt(move.length - 1) === '+'){
            isInCheck = true;
        }

        if (move.includes("x")){
            isCaptured = true;
        }

        if (isInCheck && isCaptured){
            checksAndCaptures.push(move);
            isInCheck = false;
            isCaptured = false;
            continue;
        }

        if (isInCheck){
            checks.push(move);
            isInCheck = false;
            continue;
        }

        if (isCaptured){
            captures.push(move);
            isCaptured = false;
            continue;
        }

        // if it's not a check or capture, it's a normal move.
        regularMoves.push(move);
    }

    return checksAndCaptures.concat(checks).concat(captures).concat(regularMoves);
}