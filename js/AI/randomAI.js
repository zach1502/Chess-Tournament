function randomAI(chess){
    // This AI makes random moves

    const moves = chess.moves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);
}

function normDistAI(chess){

    const moves = chess.moves();
    const move = moves[Math.floor(randn_bm() * moves.length)];
    chess.move(move);
}

async function sha256AI(chess){
    // This AI makes moves based on a sha256 hash of the board

    const moves = chess.moves();
    var sum = 0;
                     
    const hashHex = await sha256(chess.fen());
    for(var i = 0; i < hashHex.length; i++){
        // convert hex to dec
        sum += parseInt(hashHex[i], 16);
    }

    const move = moves[sum % moves.length];
    
    chess.move(move);
}

function binomialDistAI(chess){
    // This AI makes moves based on a binomial distribution

    const moves = chess.moves();
    const move = moves[Math.floor(binDist(moves.length))];
    chess.move(move);
}

function binDist(num){
    var sum = 0;
    for (var i = 0; i < num; i++){
        if (Math.floor(Math.random() * 2) & 1){
            sum++;
        }
    }
    return sum;
}

async function sha256(str){
    const msgBuffer = new TextEncoder().encode(str);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));              
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// code from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// generates a random number between 0 and 1 inclusive with a normal distribution
function randn_bm(){
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}

