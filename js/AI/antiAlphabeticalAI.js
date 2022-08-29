function antiAlphabeticalAI(chess){
    // this AI prefers to move pieces in anti-alphabetical order
    // e.g. rook, queen, pawn, knight, bishop                
    const moves = chess.moves();

    // sort moves
    var sortedMoves = moves.sort();
    chess.move(sortedMoves[sortedMoves.length - 1]);
    return;
}