import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// JSON files
import * as duolingo_quizzes from './data/duolingo_quizzes.json';
import * as common_words from './data/common_words.json';

const jsonList = [
  duolingo_quizzes,
  common_words
];

const columnOptions = {
  hanzi: 1,
  pinyin: 2,
  english: 4
};

const deleteProgressNotification = "Are you sure you want to delete your progress?";

function showHanzi(columnFormat) {
  return columnFormat & columnOptions.hanzi ? true : false;
}

function showPinyin(columnFormat) {
  return columnFormat & columnOptions.pinyin ? true : false;
}

/**
 * Returns whether a user entered a correct answer in a table cell.
 * @param acceptableAnswer answer accepted by quiz
 * @param userAnswer user's answer
 */
function isCorrect(acceptableAnswer, userAnswer) {
  if (typeof(acceptableAnswer) !== "string" || typeof(userAnswer) !== "string") {
    return false;
  }

  acceptableAnswer = acceptableAnswer.trim().toLocaleLowerCase();
  userAnswer = userAnswer.trim().toLocaleLowerCase();

  return acceptableAnswer === userAnswer;
}

/**
 * Takes a raw cell from the vocabulary list and converts it into a
 * vocabulary cell used by the table shown at the beginning of the game.
 * @param rawCell object containing "display" property and "accept" list.
 * The "display" string is what to show the user if the answer is filled
 * in, and "accept" is a list of answers a user can enter to be correct.
 * @param userAnswer user's answer; null if computer filled in
 */
function generateVocabCell(rawCell, userAnswer) {
  return {
    display: rawCell.display,
    accept: rawCell.accept || [rawCell.display],
    userAnswer: userAnswer
  };
}

/**
 * Create a new vocab cell in which userAnswer is null if the correct
 * answer was submitted.
 * @param oldCell old vocab cell
 */
function generateVerifiedVocabCell(oldCell) {
  const userAnswer = oldCell.userAnswer;
  const correct = oldCell.accept.findIndex(value => isCorrect(value, userAnswer)) !== -1;
  return {
    display: oldCell.display,
    accept: oldCell.accept,
    userAnswer: correct ? null : userAnswer
  }
}

/**
 * Create data structure representing table at the beginning of the game.
 * Follows the following JSON format:
 * [
 *   {
 *     hanzi: {
 *       display: "",
 *       accept: "",
 *       userAnswer: ""
 *     },
 *     pinyin: { same as hanzi },
 *     english: { same as hanzi and pinyin }
 *   }
 * ]
 * @param rawVocab vocabulary from JSON (not modified in this function)
 * @param columnFormat format describing which columns are enabled (see columnOptions)
 */
function generateVocabData(rawVocab, columnFormat) {
  return rawVocab.map(rawRow => {
    const numCols = columnFormat === 7 ? 3 : 2;
    const r = Math.floor(Math.random() * numCols);
    let colsSoFar = 0;
    const newRow = {};

    if (showHanzi(columnFormat)) {
      newRow.hanzi = generateVocabCell(rawRow.hanzi, r === colsSoFar ? null : "");
      colsSoFar += 1;
    } else {
      newRow.hanzi = generateVocabCell(rawRow.hanzi, null);
    }

    if (showPinyin(columnFormat)) {
      newRow.pinyin = generateVocabCell(rawRow.pinyin, r === colsSoFar ? null : "");
      colsSoFar += 1;
    } else {
      newRow.pinyin = generateVocabCell(rawRow.pinyin, null);
    }

    newRow.english = generateVocabCell(rawRow.english, r === colsSoFar ? null : "");

    return newRow;
  });
}

function copyVocabRow(vocabRow) {
  return {
    hanzi: generateVocabCell(vocabRow.hanzi, vocabRow.hanzi.userAnswer),
    pinyin: generateVocabCell(vocabRow.pinyin, vocabRow.pinyin.userAnswer),
    english: generateVocabCell(vocabRow.english, vocabRow.english.userAnswer)
  }
}

/**
 * Return a new vocab row in which correct answers are filled in 
 * (i.e. userAnswer is null).
 * @param vocabRow existing vocab row
 */
function vocabRowFilledInIfCorrect(vocabRow) {
  return {
    hanzi: generateVerifiedVocabCell(vocabRow.hanzi),
    pinyin: generateVerifiedVocabCell(vocabRow.pinyin),
    english: generateVerifiedVocabCell(vocabRow.english)
  }
}

function rowIsDirty(vocabRow) {
  return [vocabRow.hanzi, vocabRow.pinyin, vocabRow.english].reduce(
    (prev, current) => prev || current.userAnswer !== null, 
    false);
}

function calculatePercentCorrect(vocabData, columnFormat) {
  let numNull = 0;
  for (let i=0; i<vocabData.length; i++) {
    const row = vocabData[i];
    if (row.hanzi.userAnswer === null) numNull++;
    if (row.pinyin.userAnswer === null) numNull++;
    if (row.english.userAnswer === null) numNull++;
  }

  const numRows = vocabData.length;
  const numCols = columnFormat === 7 ? 3 : 2;
  const numWrong = numRows * 3 - numNull;
  const numQuestions = numRows * (numCols - 1);
  return Math.floor((1 - numWrong / numQuestions) * 100);
}

function QuizMenuItem(props) {
  return <li 
      className={props.isChosen ? ['active'] : []} 
      onClick={() => props.chooseTitle(props.displayName)}>
        {props.displayName}
    </li>;
}

function QuizList(props) {
  return props.titleList.map(title => {
      return <QuizMenuItem 
        key={title}
        displayName={title} 
        isChosen={title === props.chosenTitle}
        chooseTitle={(title) => props.chooseTitle(title)}/>
    }
  );
}

function VocabItem(props) {
  const row = props.row;

  const whatToDisplay = (cell, colNo) => 
    cell.userAnswer === null ? 
      cell.display : 
      <input type="text" value={cell.userAnswer} 
        onChange={event => props.onCellChange(row.english.display, colNo, event.target.value)}/>;

  return <tr>
    {showHanzi(props.columnFormat) && <td>{whatToDisplay(row.hanzi, 0)}</td>}
    {showPinyin(props.columnFormat) && <td>{whatToDisplay(row.pinyin, 1)}</td>}
    <td>{whatToDisplay(row.english, 2)}</td>
  </tr>;
}

function VocabList(props) {
  return props.vocab.map(row => 
    <VocabItem 
      key={row.english.display} 
      row={row}
      onCellChange={props.onCellChange}
      columnFormat={props.columnFormat}/>);
}

function VocabTable(props) {
  return <table className="vocabulary_table">
    <tbody>
      <tr>
        {showHanzi(props.columnFormat) && <th>Hanzi (汉字)</th>}
        {showPinyin(props.columnFormat) && <th>Pinyin (拼音)</th>}
        <th>English (英语)</th>
      </tr>
      <VocabList 
        vocab={props.vocab} 
        onCellChange={props.onCellChange}
        columnFormat={props.columnFormat}/>
    </tbody>
  </table>;
}

class MainSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonList: jsonList,
      chosenTitle: jsonList[0].default.title,
      vocabData: generateVocabData(jsonList[0].default.vocabulary, 7),
      percentCorrect: null,
      columnFormat: 7
    };
  }

  isDirty() {
    for (let i=0; i<this.state.vocabData.length; i++) {
      if (rowIsDirty(this.state.vocabData[i])) {
        return true;
      }
    }
    return false;
  }

  chooseTitle(title) {
    if (this.isDirty() && !window.confirm(deleteProgressNotification)) {
      return;
    }

    const chosenJson = this.state.jsonList.find(json => json.default.title === title).default;
    this.setState({
      chosenTitle: chosenJson.title,
      vocabData: generateVocabData(chosenJson.vocabulary, this.state.columnFormat),
      percentCorrect: null
    });
  }

  changeColumns(newColumnFormat) {
    if (this.isDirty() && !window.confirm(deleteProgressNotification)) {
      return;
    }

    const title = this.state.chosenTitle;
    const chosenJson = this.state.jsonList.find(json => json.default.title === title).default;
    this.setState({
      columnFormat: newColumnFormat,
      vocabData: generateVocabData(chosenJson.vocabulary, newColumnFormat),
      percentCorrect: null
    });
  }

  onCellChange(englishDisplay, columnNumber, newValue) {
    const newVocabData = this.state.vocabData.map(row => {
        const newRow = copyVocabRow(row);

        if (newRow.english.display === englishDisplay) {
          let cellToModify;
          if (columnNumber === 0) cellToModify = newRow.hanzi;
          else if (columnNumber === 1) cellToModify = newRow.pinyin;
          else if (columnNumber === 2) cellToModify = newRow.english;
          cellToModify.userAnswer = newValue;
        }

        return newRow;
      }
    );

    this.setState({
      vocabData: newVocabData
    });
  }

  onSubmit(event) {
    event.preventDefault();

    // Fill in every correct answer
    const newVocabData = this.state.vocabData.map(vocabRow => 
      vocabRowFilledInIfCorrect(vocabRow));

    this.setState({
      vocabData: newVocabData,
      percentCorrect: calculatePercentCorrect(newVocabData, this.state.columnFormat)
    });
  }

  render() {
    const titleList = this.state.jsonList.map(json => json.default.title);

    const sidebar = 
      <div key="sidebar" className="sidebar">
        <h3>Quizzes</h3>
        <ul>
          <QuizList
            titleList={titleList} 
            chosenTitle={this.state.chosenTitle}
            chooseTitle={(title) => this.chooseTitle(title)}/>
        </ul>
      </div>;

    const percentCorrect = this.state.percentCorrect;
    
    let percentClasses;
    if (percentCorrect === null) {
      percentClasses = ["invisible"];
    } else if (percentCorrect < 40) {
      percentClasses = ["redText"];
    } else if (percentCorrect < 80) {
      percentClasses = ["yellowText"];
    } else {
      percentClasses = ["greenText"];
    }

    const content =
      <div key="content" className="content">
        <h2>Memorize Chinese</h2>
        <p>{this.state.chosenTitle}</p>
        <select 
          value={`${this.state.columnFormat}`} 
          onChange={event => this.changeColumns(parseInt(event.target.value))}>
            <option value="7">Hanzi, Pinyin, and English</option>
            <option value="5">Hanzi and English</option>
            <option value="6">Pinyin and English</option>
        </select><br/><br/>
        <form onSubmit={event => this.onSubmit(event)}>
          <VocabTable 
            vocab={this.state.vocabData} 
            onCellChange={(ed, cn, nv) => this.onCellChange(ed, cn, nv)}
            columnFormat={this.state.columnFormat}/>
          <input type="submit" value="Submit"/>
          <p className={percentClasses}>{percentCorrect}&#37; correct</p>
        </form>
      </div>;

    return [sidebar, content];
  }
}

ReactDOM.render(
  <MainSite />,
  document.getElementById('root')
);