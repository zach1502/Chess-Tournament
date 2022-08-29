function antiChessAI(chess, turn){
    // Thinks its playing anti chess, captures are forced
    moves = chess.moves();
    captures = [];
    for(var i = 0; i < moves.length; i++){
        move = moves[i];
        if (move.includes("x")){
            captures.push(move);
        }
    }

    if(captures === []){
        minimaxAI(chess, turn, 3);
        return;
    }

    var random = Math.floor(Math.random() * captures.length);
    chess.move(captures[random]);
    return;
}