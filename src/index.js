import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// local imports
import * as ColumnFormat from './models/ColumnFormat';
import * as VocabData from './models/VocabDataModel';
import { QuizList } from './views/QuizSidebarView';
import { VocabTable } from './views/VocabTableView';

// JSON files
import * as duolingo_quizzes from './data/duolingo_quizzes.json';
import * as common_words from './data/common_words.json';

const jsonList = [
  duolingo_quizzes,
  common_words
];

const deleteProgressNotification = "Are you sure you want to delete your progress?";

class MainSite extends React.Component {
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
      <div key="content" className="contentContainer">
        <div className="content">
          <h2>Memorize Chinese</h2>
          <p>{this.state.chosenTitle}</p>
          <select 
            value={`${this.state.vocabData.columnFormat}`} 
            onChange={event => this.changeColumns(parseInt(event.target.value))}>
              <option value="7">Hanzi, Pinyin, and English</option>
              <option value="5">Hanzi and English</option>
              <option value="6">Pinyin and English</option>
          </select><br/><br/>
          <form onSubmit={event => this.onSubmit(event)}>
            <VocabTable 
              vocab={this.state.vocabData.vocabRows} 
              onCellChange={(ed, cn, nv) => this.onCellChange(ed, cn, nv)}
              columnFormat={this.state.vocabData.columnFormat}/>
            <input type="submit" value="Submit"/>
            <p className={percentClasses}>{percentCorrect}&#37; correct</p>
          </form>
        </div>
      </div>;

    return [sidebar, content];
  }
}

ReactDOM.render(
  <MainSite />,
  document.getElementById('root')
);