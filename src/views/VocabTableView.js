import React from 'react';

import * as ColumnFormat from '../helpers/ColumnFormat';

/**
 * One cell in the vocabulary table.
 * @param props.cell data representing vocabulary cell
 * @param props.colNo 0 for Hanzi, 1 for Pinyin, and 2 for English
 */
function VocabCellView(props) {
  if (props.cell.userAnswer === undefined) {
    return null;
  } else if (props.cell.userAnswer === null) {
    return <td>{props.cell.display}</td>;
  } else {
    return <td className="vocabCell">
      <input type="text" value={props.cell.userAnswer} 
        onChange={event => props.onCellChange(
          props.colNo, 
          event.target.value)}/>
      <button tabIndex="-1" className="showBtn" type="button"
        onClick={() => props.onCellChange(props.colNo, props.cell.display)}>
        S<span className="showBtnTooltip">Show answer</span>
      </button>
    </td>;
  }
}

/**
 * List of rows in vocabulary table.
 * @param props.row data representing row of vocabulary in table
 * @param props.onCellChange function called when any cell is changed
 */
function VocabRowView(props) {
  const row = props.row;
  const onCellChange = (colNo, value) => 
    props.onCellChange(row.id, colNo, value);
  return <tr>
    <VocabCellView cell={row.hanzi} colNo={0} onCellChange={onCellChange}/>
    <VocabCellView cell={row.pinyin} colNo={1} onCellChange={onCellChange}/>
    <VocabCellView cell={row.english} colNo={2} onCellChange={onCellChange}/>
  </tr>;
}

/**
 * List of rows in vocabulary table.
 * @param props.vocab list of vocabulary rows
 * @param props.onCellChange function called when any cell is changed
 */
function VocabListView(props) {
  return props.vocab.map(row => 
    <VocabRowView 
      key={row.id} 
      row={row}
      onCellChange={props.onCellChange}/>);
}

/**
 * Vocabulary table view.
 * @param props.vocab list of vocabulary rows
 * @param props.onCellChange function called when any cell is changed
 * @param props.columnFormat column format
 */
function VocabTableView(props) {
  return <table className="vocabulary_table">
    <tbody>
      <tr>
        {ColumnFormat.showHanzi(props.columnFormat) && <th>Hanzi (汉字)</th>}
        {ColumnFormat.showPinyin(props.columnFormat) && <th>Pinyin (拼音)</th>}
        {ColumnFormat.showEnglish(props.columnFormat) && <th>English (英语)</th>}
      </tr>
      <VocabListView 
        vocab={props.vocab} 
        onCellChange={props.onCellChange}/>
    </tbody>
  </table>;
}

/**
 * List of options in drop-down menu.
 */
function ColumnDropdownView() {
  return ColumnFormat.getColumnOptions().map(columnFormat => 
    <option value={columnFormat} key={columnFormat}>
      {ColumnFormat.getColumnTitle(columnFormat)}
    </option>);
}

/**
 * Main content of website (everything but the sidebar).
 * @param props.chosenTitle title of chosen vocabulary file
 * @param props.vocabData vocabulary data
 * @param props.percentCorrect percent of answers correct
 * @param props.changeColumns function called when columns are changed
 * @param props.onSubmit function called when submit button clicked
 * @param props.onCellChange function called when any cell is changed
 */
export function MainContentView(props) {
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
          <ColumnDropdownView />
      </select><br/><br/>
      <form onSubmit={props.onSubmit}>
        <VocabTableView 
          vocab={props.vocabData.vocabRows}
          columnFormat={props.vocabData.columnFormat} 
          onCellChange={props.onCellChange}/>
        <input type="submit" value="Submit"/>
        <p className={percentClasses}>{percentCorrect}&#37; correct</p>
      </form>
    </div>
  </div>;
}