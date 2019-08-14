import React from 'react';

import * as ColumnFormat from '../models/ColumnFormat';

function VocabItem(props) {
  const row = props.row;

  const whatToDisplay = (cell, colNo) => 
    cell.userAnswer === null ? 
      cell.display : 
      <input type="text" value={cell.userAnswer} 
        onChange={event => props.onCellChange(row.english.display, colNo, event.target.value)}/>;

  return <tr>
    {ColumnFormat.showHanzi(props.columnFormat) && <td>{whatToDisplay(row.hanzi, 0)}</td>}
    {ColumnFormat.showPinyin(props.columnFormat) && <td>{whatToDisplay(row.pinyin, 1)}</td>}
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

export function VocabTable(props) {
  return <table className="vocabulary_table">
    <tbody>
      <tr>
        {ColumnFormat.showHanzi(props.columnFormat) && <th>Hanzi (汉字)</th>}
        {ColumnFormat.showPinyin(props.columnFormat) && <th>Pinyin (拼音)</th>}
        <th>English (英语)</th>
      </tr>
      <VocabList 
        vocab={props.vocab} 
        onCellChange={props.onCellChange}
        columnFormat={props.columnFormat}/>
    </tbody>
  </table>;
}

export function MainContent(props) {
  const percentCorrect = props.percentCorrect;
    
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

  return <div key="content" className="contentContainer">
    <div className="content">
      <h2>Memorize Chinese</h2>
      <p>{props.chosenTitle}</p>
      <select 
        value={`${props.vocabData.columnFormat}`} 
        onChange={props.changeColumns}>
          <option value="7">Hanzi, Pinyin, and English</option>
          <option value="5">Hanzi and English</option>
          <option value="6">Pinyin and English</option>
      </select><br/><br/>
      <form onSubmit={props.onSubmit}>
        <VocabTable 
          vocab={props.vocabData.vocabRows} 
          onCellChange={props.onCellChange}
          columnFormat={props.vocabData.columnFormat}/>
        <input type="submit" value="Submit"/>
        <p className={percentClasses}>{percentCorrect}&#37; correct</p>
      </form>
    </div>
  </div>;
}