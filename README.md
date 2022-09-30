Looking back on this project. I should've used nodejs.  
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

## Relative Strength Of The AIs
I used the ELO rating system since that is what is used for FIDE. (learn more here: https://en.wikipedia.org/wiki/Elo_rating_system)
I initially wanted to implement the Glicko-2 rating system but unfortunately, it seems to be too complex for little benefit.
You may notice that the number of wins doesn't correlate with the elo. 
That is because Elo weighs wins and loses differently depending on the opponent's Elo
you will gain more if it was less likely for you to win, you will gain less if it was more likely for you to win!
The opposite is also true. I write more about this in `Some Notable Findings`.

Name: MiniMax AI FFFF Elo: 4203.81 W/D/L: 204/17/6

Name: MiniMax AI FFFT Elo: 3375.35 W/D/L: 130/59/6

Name: Fastest Mate AI Elo: 3042.75 W/D/L: 146/36/28

Name: Anti-Chess AI Elo: 2909.75 W/D/L: 105/89/16

Name: Checkmate Check Attack AI Elo: 1859.62 W/D/L: 68/123/19

Name: Anti-Movement AI Elo: 1645.29 W/D/L: 66/118/26

Name: Swarm AI Elo: 1112.62 W/D/L: 64/91/56

Name: BinomialDistribution AI Elo: 924.11 W/D/L: 36/136/38

Name: Random AI Elo: 700.24 W/D/L: 33/128/49

Name: Lawyer AI Elo: 657.57 W/D/L: 8/175/27

Name: Anti-Alphabetical AI Elo: 555.86 W/D/L: 19/149/41

Name: Opposite Color AI Elo: 545.19 W/D/L: 12/162/36

Name: Huddle AI Elo: 287.06 W/D/L: 5/161/44

Name: Same Color AI Elo: 284.71 W/D/L: 10/152/48

Name: Normal Distribution AI Elo: 279.16 W/D/L: 17/136/57

Name: Worstfish AI Elo: 249.06 W/D/L: 44/88/79

Name: Alphabetical AI Elo: 97.51 W/D/L: 5/149/55

Name: Self-Cripling AI Elo: -129.21 W/D/L: 1/147/62

Name: Markov AI Elo: -164.32 W/D/L: 12/131/68

Name: Suicide AI Elo: -260.98 W/D/L: 3/141/67

Name: Liberation AI Elo: -450.38 W/D/L: 5/120/85

Name: SHA-256 AI Elo: -480.45 W/D/L: 0/130/80

and Yes, negative elo IS possible! What matters in the calculations is the elo difference. So there's no ill side effects. Here's the above, but in a graph
![a graph of the ratings](https://i.imgur.com/IUjKChJ.png)

## Some Notable findings:
1. Despite it being random, Binomial Distribution AI is a fair amount "better" than pure randomness, the strongest out of the random AIs having a W/D/L of 20/78/23.
2. Oddly, Normal Distribution AI despite it being fairly similar to BinomialDistribution, performs terribly, with less than half the wins Binomial Distribution has.
3. Making your king go "LEEEEROOOOOYYYY JEEEEEEEEENKINS" has somehow won 2 games! (Suicide AI).
4. Worstfish, despite having a whopping 26 wins, it is very low rated. The reason being is that it wins more commonly against the weakest bots, but however... Essentially loses against everyone else. but that also raises a question!
5. Worstfish, despite it being told to pick the worst move, still can win!?? how and why? Well, its because my engine (MiniMax AI FFFF) is not that strong and thus what if thinks the weakest move, may accidently be the strongest or one of the strongest.
6. My engine lost 2 games, both to itself BUT with quiet search enabled (MiniMax AI FFFT) (details about what that is, below).
7. Oddly, somehow huddling together won thrice? despite it being purely 100% defensive.
8. As expected, playing aggressively (Anti-Movement, Swarm, Checkmate Check Attack AI, Fastest mate) dominates the weakest or defensive AIs! We humans found that out a while ago too. Taking the initiative is generally a really good idea.
9. The only AI without a win is SHA-256, this is likely due to it being super deterministic and hashing the board doesn't result in many mates. 
10. When a weak AI is paired against a weak AI, the games can get rediculously long. One such game lasted well over 500 moves...

## Feature Set of my minimax AI:
1. Piece square tables
2. Piece mobility
3. Transposition table
4. Quicience search
5. Futility pruning
6. Simple Move ordering
7. Opening book
8. Material table

## Explanation of each Feature: (for non-chess people)

### What are Piece Square Tables?
Some squares are better than others, you wouldn't want a knight in the corner or the king in the middle (save for some extraordinary circumstances)
Piece Square Tables gently nudges the AI to prefer better placed pieces. As a result, it ends up with better long term opportunities.

### What is Piece mobility?
A bishop blocked off in a corner is much worse than a bishop that can maneuver around. 
So extra emphasis has been placed on "good" and "bad" pieces. 
This nudges the AI to play moves with better short term and long term positioning in mind.

### What is a Transposition Table?
When you play chess, there's many different ways to reach the same position.
A Transposition table caches positions we've already seen and ensures we do not calculate it again.

### What is Futility Pruning and etc.? 
If a move doesn't change the calculated score much, we do not calculate further.
This can be a bit too agressive for low depth engines like mine.
If n is the max depth we want to go
futility happens at depth n-1, deep futility at n-2, super deep futility at n-3

### What is Quicience Search? (aka Quiet Seach)
Quiet search is an extention of a search branch. Its based around the idea of an "unstable" board state.
We go beyond what we set as the depth limit on "unstable" board states.
If the board state is in check, keep searching deeper.
If a capture just happened, keep searching deeper.
To prevent this from going too deep (and large loops of checks), Delta Pruning is used. 
Whenever the calculated score is likely to not change much, we don't calculate further. Putting a stop to infinite loops.
This is especially useful in endgame scenarios, as its very easy for an engine to overlook winning moves.
Sadly, this also suffers the same issue as with futility pruning

### What do I mean by Simple Move Ordering?
Given a list of legal moves, my AI first looks at moves that are a checkmate, then check, then capture, then attack, then the rest.
A better Move Ordering heuristic helps with Alpha-Beta Pruning's performance thus speeding up the bot.

### What is Alpha-Beta Pruning?
Simply, its not calculating moves that have been proven impossible to minimize or maximize score.
Unlike the earlier mentioned Delta pruning, Alpha-Beta pruning cannot overprune or underprune the search tree.

### What is an Opening book?
Like what the name suggests, It's a book that tells the AI how to play the first few moves.
The first few moves can be tough for a computer to figure out, so we give it a good nudge forward in the right direction.
However, how the book this AI is using was crafted from millions of human games and it includes human errors. Like falling for the Scholar's Mate.

### What is a Material table?
Rather than looping through the entire board, 
counting the number of each piece and calculating the total values roughly 30 thousand times for the opening at depth 3
Amounting to ~4 million operations.
We precalculate all of the likely material values and store it into a 1D Array.
So the total calculations required drops to only 30,000 vs the 4,000,000 prior! (An over 100x improvement!)
This only costs roughly 1/4 mb of RAM. which is fairly cheap for so much performance. 



# About each of the 22 AIs:
## Starting with the questionable ones and moving up to actually half decent ones (in rough order)

### Random AI:
Plays a random move, equal probability.

### Normal Distribution AI:
Plays a random move, distributed normally.

### Binomial Distribution AI:
Plays a random move, distributed according to the Binomial Distribution

### SHA256 AI:
Plays a move based on the hash of the board's FEN.

### Alphabetical AI:
Plays the first move when the moves are sorted a-z

### Anti-Alphabetical AI
Plays the first move when the moves are sorted z-a

### Suicide AI:
The king isn't feeling great today, so he takes a stroll out to battle
Approaches the other king

### Opposite Color AI:
Prefer's playing a move where a piece lands on the opposite colour as the player's colour
Plays a random move if not possible

### Same Color AI:
Prefer's playing a move where a piece lands on the same colour as the player's colour
Plays a random move if not possible

### Markov AI:
Uses 2 markov chains to make moves, built from 13GB of games.
if the move doesn't exist in the chain, a random one is picked

### Self Crippling AI:
Maximizes the ratio of moves it can make vs the number of opponent's moves

### Liberation AI:
Minimizes the ratio of moves it can make vs the number of opponent's moves

### Lawyer AI:
Maximizes opponent's possible moves

### Anti-Movement AI:
Minimizes opponent's possible moves

### Huddle AI:
Pieces gets as close as possible to the friendly king

### Swarm AI:
Pieces gets as close as possible to the enemy king

### Worstfish AI:
Stockfish, but my own Stockfish.
Also picks the worst calculated move.

### Anti-Chess AI:
Stockfish, but my own Stockfish.
Captures are forced

### Fast Mate AI:
Plays moves to get the fastest mate possible, no matter if its feasible or not

### Checkmate Check Attack:
Prefers moves that Checkmate first, then Check, then Attacks.

### Mini-Max AI FFFT:
Good Ol regular AI, only with quiet search enabled
FFFT = no futility, no deep futility, no super deep futility, quiet search enabled

### Mini-Max AI FFFF:
Good Ol regular AI, No Biases
FFFF = no futility, no deep futility, no super deep futility, no quiet search


..More comming soon?
