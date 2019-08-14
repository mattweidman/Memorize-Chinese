import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// local imports
import * as ColumnFormat from './models/ColumnFormat';
import * as VocabData from './models/VocabDataModel';
import { MainContent } from './views/VocabTableView';
import { QuizSidebar } from './views/QuizSidebarView';

// JSON files
import * as duolingo_quizzes from './data/duolingo_quizzes.json';
import * as common_words from './data/common_words.json';

const jsonList = [
  duolingo_quizzes,
  common_words
];

const deleteProgressNotification = "Are you sure you want to delete your progress?";

/**
 * Component representing entire website. Contains controller functions
 * and all state.
 */
class MainComponent extends React.Component {
  constructor(props) {
    super(props);

    const columnFormat = ColumnFormat.defaultColumnFormat;
    this.state = {
      jsonList: jsonList,
      chosenTitle: jsonList[0].default.title,
      vocabData: VocabData.create(jsonList[0].default.vocabulary, columnFormat),
      percentCorrect: null
    };
  }

  /**
   * Called when user clicks a title in the sidebar.
   * @param {string} title new title chosen
   */
  chooseTitle(title) {
    if (this.state.vocabData.isDirty() && !window.confirm(deleteProgressNotification)) {
      return;
    }

    const chosenJson = this.state.jsonList.find(json => json.default.title === title).default;
    this.setState({
      chosenTitle: chosenJson.title,
      vocabData: VocabData.create(chosenJson.vocabulary, this.state.vocabData.columnFormat),
      percentCorrect: null
    });
  }

  /**
   * Called when the user changes the column format.
   * @param {number} newColumnFormat column format
   */
  changeColumns(newColumnFormat) {
    if (this.state.vocabData.isDirty() && !window.confirm(deleteProgressNotification)) {
      return;
    }

    const title = this.state.chosenTitle;
    const chosenJson = this.state.jsonList.find(json => json.default.title === title).default;
    this.setState({
      vocabData: VocabData.create(chosenJson.vocabulary, newColumnFormat),
      percentCorrect: null
    });
  }

  /**
   * Called when the user changes a cell in the table.
   * @param {string} englishDisplay english vocabulary word to identify the row
   * @param {number} columnNumber 0 for hanzi, 1 for pinyin, and 2 for english
   * @param {string} newValue new cell value entered by user
   */
  onCellChange(englishDisplay, columnNumber, newValue) {
    this.setState({
      vocabData: this.state.vocabData.copyOnCellChange(englishDisplay, columnNumber, newValue)
    });
  }

  onSubmit(event) {
    event.preventDefault();

    const newVocabData = this.state.vocabData.copyOnSubmit();

    this.setState({
      vocabData: newVocabData,
      percentCorrect: newVocabData.calculatePercentCorrect()
    });
  }

  /**
   * Main render function. Returns the entire web view.
   */
  render() {
    const titleList = this.state.jsonList.map(json => json.default.title);

    return <div>

      <QuizSidebar 
        titleList={titleList} 
        chosenTitle={this.state.chosenTitle}
        chooseTitle={(title) => this.chooseTitle(title)}/>

      <MainContent 
        chosenTitle={this.state.chosenTitle}
        vocabData={this.state.vocabData}
        percentCorrect={this.state.percentCorrect}
        changeColumns={event => this.changeColumns(parseInt(event.target.value))}
        onSubmit={event => this.onSubmit(event)}
        onCellChange={(ed, cn, nv) => this.onCellChange(ed, cn, nv)}/>

    </div>;
  }
}

ReactDOM.render(
  <MainComponent />,
  document.getElementById('root')
);