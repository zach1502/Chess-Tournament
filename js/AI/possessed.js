var lastPieceMoved = "";

function possessedAI(chess){
    if(lastPieceMoved === ""){
        // pick a random move
        var moves = chess.moves();
        var move = moves[Math.floor(Math.random() * moves.length)];
        chess.move(move);

        
    }
}