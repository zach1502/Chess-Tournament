// Using games from Lichess.org, and create markov chains for each player
// Idea was born from me wanting to learn how to use AI but being too lazy to do it
// so I stuck with what I do know about AI, which is that Markov Chains are a fundamental part of AI
    // white made the move e4
    // black looks up his markov chain, when white plays e4, what is all the possible responses?
    // black then picks a move based on the probability of what humans played whenever white plays e4 regardless of the position
    // if after 100 rolls it doesn't find a move, it will pick a random move
// I could add more degrees of freedom, and then I would have something closer to an actual machine learning algorithm but eh w/e

var previousMove = "";

function markovAI(chess, turn){
    var legalMoves = chess.moves();

    if(turn){
        for (var i = 0; i < 100; i++) {
            var markovMoves = whiteMarkovChain[previousMove];
            if (markovMoves == undefined) break;

            var random = Math.random();
            var totalWeight = 0;
            for (var move in markovMoves) {
                totalWeight += markovMoves[move];
                if (random < totalWeight && legalMoves.indexOf(move) != -1) {
                    chess.move(move);
                    previousMove = move;
                    return;
                }
            }
        }
    }
    else{
        for (var i = 0; i < 100; i++) {
            var markovMoves = blackMarkovChain[previousMove];
            if (markovMoves == undefined) break;

            var random = Math.random();
            var totalWeight = 0;
            for (var move in markovMoves) {
                totalWeight += markovMoves[move];
                if (random < totalWeight && legalMoves.indexOf(move) != -1) {
                    chess.move(move);
                    previousMove = move;
                    return;
                }
            }
        }
    }

    var randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    chess.move(randomMove);
    previousMove = randomMove;
    return;
}