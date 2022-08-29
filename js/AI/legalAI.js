// makes the move that has the greatest amount of legal moves for the ENEMY
function liberationAI(chess){
    var moves = chess.moves();
    var bestMoves = [];
    var bestScore = -Infinity;

    for (var i = 0; i < moves.length; i++){
        var move = moves[i];
        chess.move(move);

        var score = chess.moves().length;

        if (chess.moves().length > bestScore){
            bestScore = score;
            bestMoves = [move];
        }
        else if (chess.moves().length === bestScore){
            bestMoves.push(move);
        }

        chess.undo();
    }

    chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
}

// makes the move that has the lowest amount of legal moves for the ENEMY
function rightRemovalAI(chess){
    var moves = chess.moves();
    var bestMoves = [];
    var bestScore = Infinity;

    for (var i = 0; i < moves.length; i++){
        var move = moves[i];
        chess.move(move);

        var score = chess.moves().length;

        if (chess.moves().length < bestScore){
            bestScore = score;
            bestMoves = [move];
        }
        else if (chess.moves().length === bestScore){
            bestMoves.push(move);
        }

        chess.undo();
    }

    chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
}

// maximize my own moves, minimize enemy moves. Score = my moves / enemy moves
function lawyerAI(chess){
    var moves = chess.moves();
    var bestMoves = [];

    var numEnemyResponses = 0;
    var numMyResponses = 0;
    var bestScore = -Infinity;

    for (var i = 0; i < moves.length; i++){
        var move = moves[i];

        // test this move
        chess.move(move);

        var enemyMoves = chess.moves();
        numEnemyResponses += enemyMoves.length;

        for(var j = 0; j < enemyMoves.length; j++){
            var enemyMove = enemyMoves[j];
            chess.move(enemyMove);
            numMyResponses += chess.moves().length;
            chess.undo();
        }

        chess.undo();

        var score = (numMyResponses/numEnemyResponses);

        if (score > bestScore){
            bestScore = score;
            bestMoves = [move];
        }
        else if (score === bestScore){
            bestMoves.push(move);
        }
    }

    chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
}

// minimize my own moves, maximize enemy moves
function selfCripplingAI(chess){
    var moves = chess.moves();
    var bestMoves = [];

    var numEnemyResponses = 0;
    var numMyResponses = 0;
    var bestScore = Infinity;

    for (var i = 0; i < moves.length; i++){
        var move = moves[i];

        // test this move
        chess.move(move);

        var enemyMoves = chess.moves();
        numEnemyResponses += enemyMoves.length;

        for(var j = 0; j < enemyMoves.length; j++){
            var enemyMove = enemyMoves[j];
            chess.move(enemyMove);
            numMyResponses += chess.moves().length;
            chess.undo();
        }

        chess.undo();

        var score = (numMyResponses/numEnemyResponses);

        if (score < bestScore){
            bestScore = score;
            bestMoves = [move];
        }
        else if (score === bestScore){
            bestMoves.push(move);
        }
    }

    chess.move(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
}
