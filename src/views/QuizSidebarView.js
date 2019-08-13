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