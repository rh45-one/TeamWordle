# Team Wordle
Collaborative wordle game with in-game chat.

### Usage
Start HTTP server using python:
`python -m http.server 8000`

### Disclaimer
The chat has not been added yet. Only the base game works.

### Dictionaries
- `La` words that can be guessed and which can be the word of the day  
- `Ta` words that can be guessed but are never selected as the word of the day  

`La` contains 2,315 words, `Ta` contains 10,657 words. The lists are sorted alphabetically and only contain unique words. No word shows up in both lists, making for a total of 12,972 which can be guessed.