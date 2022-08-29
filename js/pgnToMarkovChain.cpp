#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <map>

#include "thc.h"
#include "thc.cpp"

bool isNumber(char ch){
    return (ch >= '0' && ch <= '9');
}

int main(int argc, char* argv[]){

    std::string filePath = "Games/lichessJan2013.pgn";
    std::ofstream ofile ("markovChain.txt");   

    // no args
    if(argc == 1){
        throw std::invalid_argument("No arguments provided");
        return 0;
    }

    // PrevMove : Moves
    std::map<std::string, std::vector<std::string>> tempWhiteMarkovChain;
    std::map<std::string, std::vector<std::string>> tempBlackMarkovChain;

    // Previous Move : <move: probability>
    std::map<std::string, std::map<std::string, double>> whiteMarkovChain;
    std::map<std::string, std::map<std::string, double>> blackMarkovChain;

    std::vector<std::string> games;

    for(int fileNum = 1; fileNum < argc; fileNum++){
        filePath = argv[fileNum];

        // open a file
        std::string line;
        std::ifstream ifile (filePath);

        if(ifile.is_open()){
            bool isPreEval = false;

            while(getline(ifile, line)){

                if(line[0] != '1'){
                    continue;
                }

                for(int i = 0; i < line.length(); i++){

                    // if (line[i] == '1' && line[i+1] == '1'){
                    //     line.erase(i, line.length()-1);
                    //     continue;
                    // }

                    // 3 digit number
                    if(isNumber(line[i]) && isNumber(line[i+1]) && isNumber(line[i+2]) && line[i+3] == '.'){
                        line.erase(i, 5);
                        continue;
                    }

                    // two digit numbers
                    if(isNumber(line[i]) && isNumber(line[i+1]) && line[i+2] == '.'){
                        line.erase(i, 4);
                        continue;
                    }

                    // erase numbers followed by a .
                    if((isNumber(line[i]) && line[i+1] == '.')){
                        line.erase(i, 3);
                        continue;
                    }

                    if (line[i] == ' ' && line[i+1] == '{'){
                        isPreEval = true;
                        break;
                    }

                    if(isNumber(line[i]) && line[i+1] == '-' && isNumber(line[i+2])){
                        line.erase(i, 3);
                        continue;
                    }
                }
                
                if(!isPreEval){
                    games.emplace_back(line);
                }
            }

            thc::ChessRules cr;
            thc::Move mv;

            std::cout << "Done parsing files." << std::endl;
            std::cout << "Beginning processing..." << std::endl;

            for(int i = 0; i < games.size(); i++){
                games[i].pop_back();
                bool isWhiteTurn = true;
                std::string previousMove = "";

                // wrap each word in quotes
                std::stringstream ss(games[i]);
                std::string word;
                std::vector<std::string> line;
                while(std::getline(ss, word, ' ')){
                    std::string posFen = cr.ForsythPublish();

                    if(isWhiteTurn){
                        if(tempWhiteMarkovChain.count(previousMove)){
                            tempWhiteMarkovChain[previousMove].emplace_back(word);
                        }
                        else{
                            tempWhiteMarkovChain.emplace(previousMove, std::vector<std::string>{word});
                        }
                    }
                    else{
                        if(tempBlackMarkovChain.count(previousMove)){
                            tempBlackMarkovChain[previousMove].emplace_back(word);
                        }
                        else{
                            tempBlackMarkovChain.emplace(previousMove, std::vector<std::string>{word});
                        }
                    }

                    int lengthOfWord = word.length();
                    char charArray[lengthOfWord+1];
                    strcpy(charArray, word.c_str());

                    mv.NaturalIn(&cr, charArray);
                    cr.PlayMove(mv);
                    isWhiteTurn = !isWhiteTurn;
                    previousMove = word;
                }

                cr.Forsyth("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
            }

            ifile.close();
        }
    }

    std::cout << "Done processing." << std::endl;
    std::cout << "Calculating probabilities..." << std::endl;

    unsigned int totalNumMoves = 0;

    // calculate probabilities
    for (auto it = tempWhiteMarkovChain.begin(); it != tempWhiteMarkovChain.end(); ++it){
        totalNumMoves++;
        std::vector<std::string> moves = it->second;
        int numMoves = moves.size();
        std::map<std::string, double> probabilityPairs = std::map<std::string, double>();
        for(int i = 0; i < numMoves; i++){
            if (probabilityPairs.count(moves[i])){
                probabilityPairs[moves[i]] += 1;
            }
            else{
                // add new map pair
                probabilityPairs.emplace(moves[i], 1.0);
            }
        }

        for(auto it2 = probabilityPairs.begin(); it2 != probabilityPairs.end(); ++it2){
            probabilityPairs[it2->first] /= numMoves;
        }
        // add map to map
        // std::map<std::string, std::map<std::string, double>> whiteMarkovChain;
        whiteMarkovChain.emplace(it->first, probabilityPairs);
    }

    std::cout << "White probabilities calculated." << std::endl;

    for (auto it = tempBlackMarkovChain.begin(); it != tempBlackMarkovChain.end(); ++it){
        totalNumMoves++;
        std::vector<std::string> moves = it->second;
        int numMoves = moves.size();
        std::map<std::string, double> probabilityPairs = std::map<std::string, double>();
        for(int i = 0; i < numMoves; i++){
            if (probabilityPairs.count(moves[i])){
                probabilityPairs[moves[i]] += 1;
            }
            else{
                // add new map pair
                probabilityPairs.emplace(moves[i], 1.0);
            }
        }

        for(auto it2 = probabilityPairs.begin(); it2 != probabilityPairs.end(); ++it2){
            probabilityPairs[it2->first] /= numMoves;
        }

        blackMarkovChain.emplace(it->first, probabilityPairs);
    }

    std::cout << "Black probabilities calculated." << std::endl;

    std::cout << "Probabilities calculated." << std::endl;
    std::cout << "Outputting to file..." << std::endl;

    // std::map<std::string, std::map<std::string, double>> whiteMarkovChain;
    // std::map<std::string, std::map<std::string, double>> blackMarkovChain;
    // {
    //     (str): (str: double, str: double),
    //     (str): (str: double),
    //     (str): (str: double),
    // }

    ofile << "var whiteMarkovChain = {" << std::endl;
    auto secondLast = std::prev(whiteMarkovChain.end(), 1);
    for(auto it = whiteMarkovChain.begin(); it != whiteMarkovChain.end(); it++){
        ofile << "    \"" << it->first << "\" : {";

        auto secondLastMap = std::prev(it->second.end(), 1);
        for(auto it2 = it->second.begin(); it2 != it->second.end(); it2++){
            ofile << "\"" << it2->first << "\" : " << it2->second;

            if(it2 != secondLastMap){
                ofile << ", ";
            }
        }

        ofile << "}";

        if(it != secondLast){
            ofile << ",";
        }
        ofile << std::endl;
    }
    ofile << "}"  << std::endl;

    std::cout << "White Markov Chain written to file." << std::endl;

    ofile << "var blackMarkovChain = {" << std::endl;
    secondLast = std::prev(blackMarkovChain.end(), 1);
    for(auto it = whiteMarkovChain.begin(); it != whiteMarkovChain.end(); it++){
        ofile << "    \"" << it->first << "\" : {";

        auto secondLastMap = std::prev(it->second.end(), 1);
        for(auto it2 = it->second.begin(); it2 != it->second.end(); it2++){
            ofile << "\"" << it2->first << "\" : " << it2->second;

            if(it2 != secondLastMap){
                ofile << ", ";
            }
        }

        ofile << "}";

        if(it != secondLast){
            ofile << ",";
        }
        ofile << std::endl;
    }
    ofile << "}" << std::endl;
    ofile.close();

    std::cout << "Black Markov Chain written to file." << std::endl;

    std::cout << "Games: " << games.size() << std::endl;
    std::cout << "number of moves: " << totalNumMoves << std::endl;
}