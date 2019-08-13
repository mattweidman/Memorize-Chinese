import * as ColumnFormat from './ColumnFormat';
import * as VocabCell from './VocabCellModel';

/**
 * Represents one row in the vocabulary table.
 */
export class VocabRow {
  /**
   * @param {VocabCell} hanzi hanzi vocab cell
   * @param {VocabCell} pinyin pinyin vocab cell
   * @param {VocabCell} english english vocab cell
   */
  constructor(hanzi, pinyin, english) {
    this.hanzi = hanzi;
    this.pinyin = pinyin;
    this.english = english;
  }

  /**
   * Copy vocabulary row.
   */
  copy() {
    return new VocabRow(this.hanzi.copy(), this.pinyin.copy(), this.english.copy());  
  }

  /**
   * Copies this row and changes the userAnswer if englishDisplay parameter
   * is the same as this one's englishDisplay.
   * @param {string} englishDisplay english vocabulary word
   * @param {number} columnNumber which column to modify; 0 for hanzi, 1 for
   * pinyin, and 2 for english
   * @param {string} newValue value to place in cell
   */
  copyAndChangeIfMatches(englishDisplay, columnNumber, newValue) {
    const newRow = this.copy();

    if (newRow.english.display === englishDisplay) {
      let cellToModify;
      if (columnNumber === 0) cellToModify = newRow.hanzi;
      else if (columnNumber === 1) cellToModify = newRow.pinyin;
      else if (columnNumber === 2) cellToModify = newRow.english;
      cellToModify.userAnswer = newValue;
    }

    return newRow;
  }

  /**
   * Return a new vocab row in which correct answers are filled in 
   * (i.e. userAnswer is null).
   */
  copyAndFillInIfCorrect() {
    return new VocabRow(
      this.hanzi.copyAndFillInIfCorrect(),
      this.pinyin.copyAndFillInIfCorrect(),
      this.english.copyAndFillInIfCorrect());
  }

  /**
   * Whether this vocabulary row has been modified.
   * @param {number} columnFormat column format
   */
  isDirty(columnFormat) {
    const numCols = ColumnFormat.numCols(columnFormat);
    const numBlanks = [this.hanzi, this.pinyin, this.english].reduce(
      (prev, current) => prev + (current.userAnswer === "" ? 1 : 0), 0);
    return numCols === numBlanks + 1;
  }
}

/**
 * Creates a new vocabulary row data structure from JSON.
 * @param {*} rawRow object containing "hanzi", "pinyin", and "english" objects
 * that can be converted into VocabCells.
 * @param {number} columnFormat format describing which columns are enabled 
 * (see columnOptions)
 */
export function create(rawRow, columnFormat) {
  const numCols = ColumnFormat.numCols(columnFormat);
  const r = Math.floor(Math.random() * numCols);
  let colsSoFar = 0;

  let hanzi;
  if (ColumnFormat.showHanzi(columnFormat)) {
    hanzi = VocabCell.create(rawRow.hanzi, r === colsSoFar ? null : "");
    colsSoFar += 1;
  } else {
    hanzi = VocabCell.create(rawRow.hanzi, null);
  }

  let pinyin;
  if (ColumnFormat.showPinyin(columnFormat)) {
    pinyin = VocabCell.create(rawRow.pinyin, r === colsSoFar ? null : "");
    colsSoFar += 1;
  } else {
    pinyin = VocabCell.create(rawRow.pinyin, null);
  }

  const english = VocabCell.create(rawRow.english, r === colsSoFar ? null : "");

  return new VocabRow(hanzi, pinyin, english);
}