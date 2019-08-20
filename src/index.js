import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// local imports
import * as ColumnFormat from './models/ColumnFormat';
import * as VocabData from './models/VocabDataModel';
import { MainContentView } from './views/VocabTableView';
import { QuizSidebarView } from './views/QuizSidebarView';

// JSON files
import * as all_vocabulary from './data/all_vocabulary.json';
import * as duolingo_quizzes_1 from './data/duolingo_quizzes_1.json';
import * as duolingo_quizzes_2 from './data/duolingo_quizzes_2.json';
import * as common_words from './data/common_words.json';

const jsonList = [
  duolingo_quizzes_1,
  duolingo_quizzes_2,
  common_words
];

const deleteProgressNotification = "Are you sure you want to delete your progress?";

/**
 * Creates a list of vocabulary by combining a list of vocabulary with IDs
 * with a list of IDs indicating which vocabulary to show.
 * @param {*} allVocab JSON containing all vocabulary words
 * @param {*} json JSON containing title and list of IDs in allVocab
 */
function getVocabularyFromJson(allVocab, json) {
  const vocabIdList = json.default.vocabulary.map(item => item.id);
  return vocabIdList.map(id => allVocab.default.vocabulary.find(vocab => vocab.id === id));
}

/**
 * Component representing entire website. Contains controller functions
 * and all state.
 */
class MainComponent extends React.Component {
  constructor(props) {
    super(props);

    const columnFormat = ColumnFormat.defaultColumnFormat;
    const chosenJson = jsonList[0];
    const vocab = getVocabularyFromJson(all_vocabulary, chosenJson);

    this.state = {
      all_vocabulary: all_vocabulary,
      jsonList: jsonList,
      chosenTitle: chosenJson.default.title,
      vocabData: VocabData.create(vocab, columnFormat),
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

    const chosenJson = this.state.jsonList.find(json => json.default.title === title);
    const vocab = getVocabularyFromJson(this.state.all_vocabulary, chosenJson);

    this.setState({
      chosenTitle: chosenJson.default.title,
      vocabData: VocabData.create(vocab, this.state.vocabData.columnFormat),
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
    const chosenJson = this.state.jsonList.find(json => json.default.title === title);
    const vocab = getVocabularyFromJson(this.state.all_vocabulary, chosenJson);

    this.setState({
      vocabData: VocabData.create(vocab, newColumnFormat),
      percentCorrect: null
    });
  }

  /**
   * Called when the user changes a cell in the table.
   * @param {string} id id to identify the row
   * @param {number} columnNumber 0 for hanzi, 1 for pinyin, and 2 for english
   * @param {string} newValue new cell value entered by user
   */
  onCellChange(id, columnNumber, newValue) {
    this.setState({
      vocabData: this.state.vocabData.copyOnCellChange(id, columnNumber, newValue)
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

      <QuizSidebarView 
        titleList={titleList} 
        chosenTitle={this.state.chosenTitle}
        chooseTitle={(title) => this.chooseTitle(title)}/>

      <MainContentView 
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