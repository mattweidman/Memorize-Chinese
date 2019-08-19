import React from 'react';

function QuizMenuItemView(props) {
  return <li 
      className={props.isChosen ? ['active'] : []} 
      onClick={() => props.chooseTitle(props.displayName)}>
        {props.displayName}
    </li>;
}

function QuizListView(props) {
  return props.titleList.map(title => {
      return <QuizMenuItemView 
        key={title}
        displayName={title} 
        isChosen={title === props.chosenTitle}
        chooseTitle={(title) => props.chooseTitle(title)}/>
    }
  );
}

export function QuizSidebarView(props) {
  return <div key="sidebar" className="sidebar">
    <h3>Quizzes</h3>
    <ul>
      <QuizListView
        titleList={props.titleList} 
        chosenTitle={props.chosenTitle}
        chooseTitle={props.chooseTitle}/>
    </ul>
  </div>;
}