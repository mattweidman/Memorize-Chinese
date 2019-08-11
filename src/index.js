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
  const classNames = props.isChosen ? ['active'] : [];

  return <li 
    className={classNames} 
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

class MainSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonList: jsonList,
      chosenTitle: jsonList[0].default.title
    };
  }

  chooseTitle(title) {
    this.setState({chosenTitle: title});
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
      </div>;

    return [sidebar, content];
  }
}


ReactDOM.render(
  <MainSite />,
  document.getElementById('root')
);