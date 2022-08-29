async function CheckmateCheckAttack(chess){
    moveList = chess.moves();
    var checkmates = [];
    var checks = [];
    var captures = [];
    var attacks = [];
    var regularMoves = [];
    var isRegular = true;

    for (var i = 0; i < moveList.length; i++){
        isRegular = true;
        var move = moveList[i];

        if (move.charAt(move.length - 1) == '#'){
            checkmates.push(move);
            continue;
        }

        if (move.charAt(move.length - 1) == '+'){
            checks.push(move);
            continue;
        }

        if (move.includes('x')){
            captures.push(move);
            continue;
        }

        chess.move(move);
        var futureMoves = chess.moves();
        for (var j = 0; j < futureMoves.length; j++){
            if (futureMoves[j].includes('x')){
                attacks.push(move);
                isRegular = false;
                break;
            }
        }
        chess.undo();

        if (isRegular){
            regularMoves.push(move);
        }
    }

    if (checkmates.length > 0){
        chess.move(checkmates[Math.floor(Math.random() * checkmates.length)]);
    }
    else if (checks.length > 0){
        chess.move(checks[Math.floor(Math.random() * checks.length)]);
    }
    else if (captures.length > 0){
        chess.move(captures[Math.floor(Math.random() * captures.length)]);
    }
    else if (attacks.length > 0){
        chess.move(attacks[Math.floor(Math.random() * attacks.length)]);
    }
    else{
        chess.move(regularMoves[Math.floor(Math.random() * regularMoves.length)]);
    }
}