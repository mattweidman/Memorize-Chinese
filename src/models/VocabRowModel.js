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
      this.hanzi.copyAndFillInIfCorrect(0),
      this.pinyin.copyAndFillInIfCorrect(1),
      this.english.copyAndFillInIfCorrect(2));
  }

  /**
   * Whether this vocabulary row has been modified.
   */
  isDirty() {
    // return true if hanzi, pinyin, or english has a userAnswer that
    // is not undefined, null, or empty string.
    return false || // false is used to convert other values to boolean
      this.hanzi.userAnswer || 
      this.pinyin.userAnswer || 
      this.english.userAnswer;
  }

  /**
   * Gets the number of cells in this row that were answered correctly when 
   * submit was pressed.
   * @param {number} columnFormat column format
   */
  getNumCorrect() {
    const numNulls = [this.hanzi, this.pinyin, this.english].reduce(
      (prev, cell) => prev + (cell.userAnswer === null ? 1 : 0), 0);

    // assuming 1 column is filled at the beginning
    return numNulls - 1;
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
  const rowFormat = ColumnFormat.getInitialRowFormat(columnFormat);
  const hanzi = VocabCell.create(rawRow.hanzi, rowFormat[0]);
  const pinyin = VocabCell.create(rawRow.pinyin, rowFormat[1]);
  const english = VocabCell.create(rawRow.english, rowFormat[2]);
  return new VocabRow(hanzi, pinyin, english);
}