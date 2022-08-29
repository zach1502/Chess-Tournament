#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <sstream>
#include <algorithm>

#include "thc.h"

bool isNumber(char ch){
    return (ch >= '0' && ch <= '9');
}

int main(int argc, char* argv[]){

    std::string filePath = "Games/lichessJan2013.pgn";
    std::ofstream ofile ("Games/openingBook.txt");

    ofile << "[\n";       

    for(int fileNum = 1; fileNum < argc; fileNum++){
        filePath = argv[fileNum];

        // open a file
        std::string line;
        std::ifstream ifile (filePath);

        if(ifile.is_open()){
            bool isPreEval = false;
            std::vector<std::string> games;

            while(getline(ifile, line)){

                if(line[0] != '1'){
                    continue;
                }

                for(int i = 0; i < line.length(); i++){

                    if (line[i] == '1' && line[i+1] == '1'){
                        line.erase(i, line.length()-1);
                        continue;
                    }

                    // remove double digit numbers
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


            std::sort(games.begin(), games.end());

            std::string jsonStr = "";        

            for(int i = 0; i < games.size(); i++){
                // replace all spaces with commas
                games[i].pop_back();

                // wrap each word in quotes
                std::stringstream ss(games[i]);
                std::string word;
                std::string newLine = "";
                while(std::getline(ss, word, ' ')){
                    newLine += "\"" + word + "\"";
                    newLine += ",";
                }
                newLine.pop_back();

                jsonStr += "    [" + newLine + "],\n";
            }

            if(fileNum == argc - 1){
                jsonStr.pop_back();
                jsonStr.pop_back();
            }

            ofile << jsonStr;
            ifile.close();
        }
    }
    ofile << "\n]";
    ofile.close();
}