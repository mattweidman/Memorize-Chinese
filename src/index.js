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
  return <tr>
    <td>{props.row.hanzi.display}</td>
    <td>{props.row.pinyin.display}</td>
    <td>{props.row.english.display}</td>
  </tr>;
}

function VocabList(props) {
  return props.vocab.map(row => <VocabItem key={row.english.display} row={row}/>);
}

function VocabTable(props) {
  return <table className="vocabulary_table">
    <tbody>
      <tr>
        <th>Hanzi (汉字)</th>
        <th>Pinyin (拼音)</th>
        <th>English (英语)</th>
      </tr>
      <VocabList vocab={props.vocab}/>
    </tbody>
  </table>;
}

class MainSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonList: jsonList,
      chosenJson: jsonList[0].default
    };
  }

  chooseTitle(title) {
    this.setState({
      chosenJson: this.state.jsonList.find(json => json.default.title === title).default
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
            chosenTitle={this.state.chosenJson.title}
            chooseTitle={(title) => this.chooseTitle(title)}/>
        </ul>
      </div>;
    
    const content =
      <div key="content" className="content">
        <h2>Memorize Chinese</h2>
        <VocabTable vocab={this.state.chosenJson.vocabulary}/>
      </div>;

    return [sidebar, content];
  }
}

ReactDOM.render(
  <MainSite />,
  document.getElementById('root')
);