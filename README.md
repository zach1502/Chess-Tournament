Looking back on this project. I shouldve used nodejs.
but back then I only know that I can run js by including it in a <script> tag.

if you want to run this project. 
Simply open index.html in a modern web browser.
and BAM the tournament starts.
output is pushed into console and a basic UI.

This tournament format is Round-Robin and as a result will take DAYS maybe WEEKS to run from start to finish.
22 * 21 = 462 games per round, by default its set to 5 rounds.

In the folder named "js", there's some cpp code. 
Those are used for creating Markov Chains and Opening Books from Pgns for the markov ai and minimax.
Feel free to swap out the Chains and/or Books used!


##Feature Set of my minimax AI:
1. Piece square tables
2. Piece mobility
3. Transposition table
4. Quicience search
5. Futility pruning
6. Simple Move ordering
7. Opening book
8. Material table

##Explanation of each Feature: (for non-chess people)

###What are Piece Square Tables?
Some squares are better than others, you wouldn't want a knight in the corner or the king in the middle (save for some extraordinary circumstances)
Piece Square Tables gently nudges the AI to prefer better placed pieces. As a result, it ends up with better long term opportunities.

###What is Piece mobility?
A bishop blocked off in a corner is much worse than a bishop that can maneuver around. 
So extra emphasis has been placed on "good" and "bad" pieces. 
This nudges the AI to play moves with better short term and long term positioning in mind.

###What is a Transposition Table?
When you play chess, there's many different ways to reach the same position.
A Transposition table caches positions we've already seen and ensures we do not calculate it again.

###What is Futility Pruning and etc.? 
If a move doesn't change the calculated score much, we do not calculate further.
This can be a bit too agressive for low depth engines like mine.
If n is the max depth we want to go
futility happens at depth n-1, deep futility at n-2, super deep futility at n-3

###What is Quicience Search? (aka Quiet Seach)
Quiet search is an extention of a search branch. Its based around the idea of an "unstable" board state.
We go beyond what we set as the depth limit on "unstable" board states.
If the board state is in check, keep searching deeper.
If a capture just happened, keep searching deeper.
To prevent this from going too deep (and large loops of checks), Delta Pruning is used. 
Whenever the calculated score is likely to not change much, we don't calculate further. Putting a stop to infinite loops.
This is especially useful in endgame scenarios, as its very easy for an engine to overlook winning moves.
Sadly, this also suffers the same issue as with futility pruning

###What do I mean by Simple Move Ordering?
Given a list of legal moves, my AI first looks at moves that are a checkmate, then check, then capture, then attack, then the rest.
A better Move Ordering heuristic helps with Alpha-Beta Pruning's performance thus speeding up the bot.

###What is Alpha-Beta Pruning?
Simply, its not calculating moves that have been proven impossible to minimize or maximize score.
Unlike the earlier mentioned Delta pruning, Alpha-Beta pruning cannot overprune or underprune the search tree.

###What is an Opening book?
Like what the name suggests, It's a book that tells the AI how to play the first few moves.
The first few moves can be tough for a computer to figure out, so we give it a good nudge forward in the right direction.
However, how the book this AI is using was crafted from millions of human games and it includes human errors. Like falling for the Scholar's Mate.

###What is a Material table?
Rather than looping through the entire board, 
counting the number of each piece and calculating the total values roughly 30 thousand times for the opening at depth 3
Amounting to ~4 million operations.
We precalculate all of the likely material values and store it into a 1D Array.
So the total calculations required drops to only 30,000 vs the 4,000,000 prior! (An over 100x improvement!)
This only costs roughly 1/4 mb of RAM. which is fairly cheap for so much performance. 



#About each of the 22 AIs:
##Starting with the questionable ones and moving up to actually half decent ones (in rough order)

###Random AI:
Plays a random move, equal probability.

###Normal Distribution AI:
Plays a random move, distributed normally.

###Binomial Distribution AI:
Plays a random move, distributed according to the Binomial Distribution

###SHA256 AI:
Plays a move based on the hash of the board's FEN.

###Alphabetical AI:
Plays the first move when the moves are sorted a-z

###Anti-Alphabetical AI
Plays the first move when the moves are sorted z-a

###Suicide AI:
The king isn't feeling great today, so he takes a stroll out to battle
Approaches the other king

###Opposite Color AI:
Prefer's playing a move where a piece lands on the opposite colour as the player's colour
Plays a random move if not possible

###Same Color AI:
Prefer's playing a move where a piece lands on the same colour as the player's colour
Plays a random move if not possible

###Markov AI:
Uses 2 markov chains to make moves, built from 13GB of games.
if the move doesn't exist in the chain, a random one is picked

###Self Crippling AI:
Maximizes the ratio of moves it can make vs the number of opponent's moves

###Liberation AI:
Minimizes the ratio of moves it can make vs the number of opponent's moves

###Lawyer AI:
Maximizes opponent's possible moves

###Anti-Movement AI:
Minimizes opponent's possible moves

###Huddle AI:
Pieces gets as close as possible to the friendly king

###Swarm AI:
Pieces gets as close as possible to the enemy king

###Worstfish AI:
Stockfish, but my own Stockfish.
Also picks the worst calculated move.

###Anti-Chess AI:
Stockfish, but my own Stockfish.
Captures are forced

###Fast Mate AI:
Plays moves to get the fastest mate possible, no matter if its feasible or not

###Checkmate Check Attack:
Prefers moves that Checkmate first, then Check, then Attacks.

###Mini-Max AI FFFT:
Good Ol regular AI, only with quiet search enabled
FFFT = no futility, no deep futility, no super deep futility, quiet search enabled

###Mini-Max AI FFFF:
Good Ol regular AI, No Biases
FFFF = no futility, no deep futility, no super deep futility, no quiet search


..More comming soon?
