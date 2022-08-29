function arrToSquare(arr){
    if (arr.length !== 2) throw new Error("Not a square");

    return (arr[1] + 10).toString(18) + (8 - arr[0]).toString(10); 
}

function huddleAI(chess, turn){
    // favours moves close to the king
    var friendColor = (turn) ? 'w' : 'b'; 
    var kingPosition;
    var piecesPosition = [];
    var board = chess.board()

    // get king position
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){

            if(board[i][j] !== null){
                if(board[i][j].color === friendColor){
                    if(board[i][j].type === 'k'){
                        // king position
                        kingPosition = [i, j];
                    }
                    else{
                        // find all friendly pieces
                        piecesPosition.push([i, j]);
                    }
                }
            }
        }
    }

    // distance measured in king moves away. 
    var currentTotalDistanceFromKing = 0;

    for(var i = 0; i < piecesPosition.length; i++){
        var distanceFromKing = Math.max(Math.abs(kingPosition[0] - piecesPosition[i][0]), Math.abs(kingPosition[1] - piecesPosition[i][1]));
        currentTotalDistanceFromKing += distanceFromKing;
    }


    // get all moves
    var moves = chess.moves();

    var bestMoves = null;
    var bestDifference = 9999;

    for(var i = 0; i < moves.length; i++){
        var move = moves[i];
        chess.move(move);
        board = chess.board();

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

        var newPiecePosition = [8-parseInt(movedToSquare[1], 10), (parseInt(movedToSquare[0], 18) - 10)];

        for(var j = 0; j < piecesPosition.length; j++){
            if(board[piecesPosition[j][0]][piecesPosition[j][1]] === null){
                var prevDistanceFromKing = Math.max(Math.abs(kingPosition[0] - piecesPosition[j][0]), Math.abs(kingPosition[1] - piecesPosition[j][1]));
                var newDistanceFromKing = Math.max(Math.abs(kingPosition[0] - newPiecePosition[0]), Math.abs(kingPosition[1] - newPiecePosition[1]));
                
                if(bestDifference < (prevDistanceFromKing - newDistanceFromKing) || bestMoves === null){
                    bestMoves = [];
                    bestDifference = prevDistanceFromKing - newDistanceFromKing;
                    bestMoves.push(move);
                }
                else if (bestDifference === (prevDistanceFromKing - newDistanceFromKing)){
                    bestMoves.push(move);
                }
                break;
            }
        }

        chess.undo();
    }

    if (bestMoves === null){
        chess.move(moves[Math.floor(Math.random() * moves.length)]);
    }
    else{
        chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
    }
}

// Ai that tries to move pieces infront of the piece