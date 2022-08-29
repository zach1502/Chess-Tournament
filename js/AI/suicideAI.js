function suicideAI(chess, turn){
    var enemyColor = (turn) ? "b" : "w";

    var moves = chess.moves();
    kingMoves = pickoutKingMoves(moves);

    // random number
    if(kingMoves.length === 0 || Math.random() < 0.4){
        // random Move
        chess.move(moves[Math.floor(Math.random() * moves.length)]);
        return;
    }


    const board = chess.board();
    var friendlyKingPos;
    var enemyKingPos;

    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){

            square = board[i][j];

            if(square === null) continue;
            if(square.type !== "k") continue;

            if(square.color === enemyColor){
                enemyKingPos = [i, j];
            }
            else{
                friendlyKingPos = [i, j];
            }
        }
    }

    var currentDistanceFromKing = Math.max(Math.abs(friendlyKingPos[0] - enemyKingPos[0]), Math.abs(friendlyKingPos[1] - enemyKingPos[1]));
    var bestMove = null;
    for (var i = 0; i < kingMoves.length; i++){
        var move = kingMoves[i];
        // last two characters
        var square = move.slice(-2);
        var arr = [8-parseInt(square[1], 10), (parseInt(square[0], 18) - 10)];

        var newDistanceFromKing = Math.max(Math.abs(friendlyKingPos[0] - arr[0]), Math.abs(friendlyKingPos[1] - arr[1]));

        if (currentDistanceFromKing > newDistanceFromKing || bestMove === null){
            bestMove = move;
            currentDistanceFromKing = newDistanceFromKing;
        }
    }

    chess.move(bestMove);
}

function arrToSquare(arr){
    if (arr.length !== 2) throw new Error("Not a square");

    return (arr[1] + 10).toString(18) + (8 - arr[0]).toString(10); 
}

function pickoutKingMoves(moves){
    arr = [];
    for (var i = 0; i < moves.length; i++){
        if(moves[i].includes("K")){
            arr.push(moves[i]); 
        }
    }

    return arr;
}