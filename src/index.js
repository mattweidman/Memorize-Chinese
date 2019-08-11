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
 */
function generateVocabData(rawVocab) {
  return rawVocab.map(rawRow => {
    const r = Math.floor(Math.random() * 3);

    return {
      hanzi: generateVocabCell(rawRow.hanzi, r === 0 ? null : ""),
      pinyin: generateVocabCell(rawRow.pinyin, r === 1 ? null : ""),
      english: generateVocabCell(rawRow.english, r === 2 ? null : ""),
    };
  });
}

function copyVocabRow(vocabRow) {
  return {
    hanzi: generateVocabCell(vocabRow.hanzi, vocabRow.hanzi.userAnswer),
    pinyin: generateVocabCell(vocabRow.pinyin, vocabRow.pinyin.userAnswer),
    english: generateVocabCell(vocabRow.english, vocabRow.english.userAnswer),
  }
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
    <td>{whatToDisplay(row.hanzi, 0)}</td>
    <td>{whatToDisplay(row.pinyin, 1)}</td>
    <td>{whatToDisplay(row.english, 2)}</td>
  </tr>;
}

function VocabList(props) {
  return props.vocab.map(row => 
    <VocabItem 
      key={row.english.display} 
      row={row}
      onCellChange={props.onCellChange}/>);
}

function VocabTable(props) {
  return <table className="vocabulary_table">
    <tbody>
      <tr>
        <th>Hanzi (汉字)</th>
        <th>Pinyin (拼音)</th>
        <th>English (英语)</th>
      </tr>
      <VocabList 
        vocab={props.vocab} 
        onCellChange={props.onCellChange}/>
    </tbody>
  </table>;
}

class MainSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonList: jsonList,
      chosenTitle: jsonList[0].default.title,
      vocabData: generateVocabData(jsonList[0].default.vocabulary)
    };
  }

  chooseTitle(title) {
    const chosenJson = this.state.jsonList.find(json => json.default.title === title).default;
    this.setState({
      chosenTitle: chosenJson.title,
      vocabData: generateVocabData(chosenJson.vocabulary)
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

    const content =
      <div key="content" className="content">
        <h2>Memorize Chinese</h2>
        <VocabTable 
          vocab={this.state.vocabData} 
          onCellChange={(ed, cn, nv) => this.onCellChange(ed, cn, nv)}/>
      </div>;

    return [sidebar, content];
  }
}

ReactDOM.render(
  <MainSite />,
  document.getElementById('root')
);