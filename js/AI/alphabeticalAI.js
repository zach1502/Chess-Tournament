function alphabeticalAI(chess){
    // this AI prefers to move pieces in alphabetical order
    // e.g. bishop, knight, pawn, queen, rook

    const moves = chess.moves();

    // sort moves
    var sortedMoves = moves.sort();
    chess.move(sortedMoves[0]);
    return;
}