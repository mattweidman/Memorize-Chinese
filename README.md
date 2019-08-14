# Memorize Chinese

This is a React application used to help me memorize Chinese characters.

The webpage includes a grid with three columns: hanzi (Chinese characters), pinyin (Chinese pronunciations), and English. Cells across the same row have the same meaning. Two cells are randomly blanked out in each row. The goal for the user is to fill in every blank cell correctly.

Vocabulary data for each quiz is stored in a JSON format. This application allows the user to switch between different quiz JSONs. See src/data for example JSONs.

### TODO

1. ~~Refactor MainSite a little more~~
2. Refactor the way ColumnFormat works
3. More, smaller quizzes
4. Options for Hanzi -> English, Pinyin -> English, English -> Hanzi, and English -> Pinyin
5. Option to show answers
6. Accept numbers as well as accents in Pinyin

* Create backend for saving progress
* Quiz editor
* Fancier CSS
* Way to download a subset of a table as a new quiz JSON (?)
* Tabbing goes down columns before rows (?)

### Running

Enter `npm start` in the command prompt.

### Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).