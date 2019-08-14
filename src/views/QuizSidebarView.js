import React from 'react';

function QuizMenuItem(props) {
  return <li 
      className={props.isChosen ? ['active'] : []} 
      onClick={() => props.chooseTitle(props.displayName)}>
        {props.displayName}
    </li>;
}

export function QuizList(props) {
  return props.titleList.map(title => {
      return <QuizMenuItem 
        key={title}
        displayName={title} 
        isChosen={title === props.chosenTitle}
        chooseTitle={(title) => props.chooseTitle(title)}/>
    }
  );
}

export function QuizSidebar(props) {
  return <div key="sidebar" className="sidebar">
    <h3>Quizzes</h3>
    <ul>
      <QuizList
        titleList={props.titleList} 
        chosenTitle={props.chosenTitle}
        chooseTitle={props.chooseTitle}/>
    </ul>
  </div>;
}