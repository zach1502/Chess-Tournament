
function sameColorAI(chess, turn){
    // white pieces on white squares, black pieces on black squares
    var moves = chess.moves();

    var bestMoves = [];

    for (var i = 0; i < moves.length; i++){
        var move = moves[i];
        var movedToSquare = "";

        if (move.includes('x') && move.includes('=')){
            movedToSquare = move.substring(2, 4);
        }
        else if(move.includes('=')){
            movedToSquare = move[0] + move[1];
        }
        else{
            movedToSquare = (chess.in_check() || chess.in_checkmate()) ? move.slice(-3) :  move.slice(-2);
        }

        // a4 -> [4, 0] == white
        // b4 -> [4, 1] == black
        // g2 -> [6, 6] == white
        piecePosition = [8-parseInt(movedToSquare[1], 10), (parseInt(movedToSquare[0], 18) - 10)];

        var isSquareBlack = ((piecePosition[0] * 7) + piecePosition[1]) & 1;
        var isPlayerBlack = (turn) ? 0 : 1;
        if (isSquareBlack === isPlayerBlack){
            bestMoves.push(move);
        }
    }

    if (bestMoves.length > 0){
        chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
        return
    }

    chess.move(moves[Math.floor(Math.random() * moves.length)]);
}

function oppositeColorAI(chess, turn){
    var moves = chess.moves();

    var bestMoves = [];

    for (var i = 0; i < moves.length; i++){
        var move = moves[i];
        var movedToSquare = "";

        if (move.includes('x') && move.includes('=')){
            movedToSquare = move.substring(2, 4);
        }
        else if(move.includes('=')){
            movedToSquare = move[0] + move[1];
        }
        else{
            movedToSquare = (chess.in_check() || chess.in_checkmate()) ? move.slice(-3) :  move.slice(-2);
        }

        piecePosition = [8-parseInt(movedToSquare[1], 10), (parseInt(movedToSquare[0], 18) - 10)];

        var isSquareBlack = ((piecePosition[0] * 7) + piecePosition[1]) & 1;
        var isPlayerBlack = (turn) ? 0 : 1;
        if (isSquareBlack !== isPlayerBlack){
            bestMoves.push(move);
        }
    }

    if (bestMoves.length > 0){
        chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
        return
    }

    chess.move(moves[Math.floor(Math.random() * moves.length)]);
}