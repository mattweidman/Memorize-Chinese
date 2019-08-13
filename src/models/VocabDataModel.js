import * as ColumnFormat from './ColumnFormat';
import * as VocabRow from './VocabRowModel';

/**
 * Contains all state used to display the vocabulary table form.
 * Includes the list of vocabulary rows and the column format.
 */
export class VocabData {
  /**
   * @param {*[]} vocabRows list of VocabRows
   * @param {number} columnFormat column format
   */
  constructor(vocabRows, columnFormat) {
    this.vocabRows = vocabRows;
    this.columnFormat = columnFormat;
  }

  /**
   * Copy data model when a cell changes.
   * @param {string} englishDisplay english vocabulary word
   * @param {number} columnNumber which column to modify; 0 for hanzi, 1 for
   * pinyin, and 2 for english
   * @param {string} newValue value to place in cell
   */
  copyOnCellChange(englishDisplay, columnNumber, newValue) {
    const newVocabRows = this.vocabRows.map(row => 
      row.copyAndChangeIfMatches(englishDisplay, columnNumber, newValue));
    return new VocabData(newVocabRows, this.columnFormat);
  }

  /**
   * Copy data model and replace every correct answer with a filled-in cell
   * (i.e. a cell with a null userAnswer).
   */
  copyOnSubmit() {
    const newVocabRows = this.vocabRows.map(vocabRow => vocabRow.copyAndFillInIfCorrect());
    return new VocabData(newVocabRows, this.columnFormat);
  }

  /**
   * Calculate percentage of cells that were filled in correctly, not including
   * cells that were originally filled in by the application.
   */
  calculatePercentCorrect() {
    let numNull = 0;
    for (let i=0; i<this.vocabRows.length; i++) {
      const row = this.vocabRows[i];
      if (row.hanzi.userAnswer === null) numNull++;
      if (row.pinyin.userAnswer === null) numNull++;
      if (row.english.userAnswer === null) numNull++;
    }

    const numRows = this.vocabRows.length;
    const numCols = ColumnFormat.numCols(this.columnFormat);
    const numWrong = numRows * 3 - numNull;
    const numQuestions = numRows * (numCols - 1);
    return Math.floor((1 - numWrong / numQuestions) * 100);
  }

  /**
   * Returns whether the user has modified any cells yet.
   */
  isDirty() {
    for (let i=0; i<this.vocabRows.length; i++) {
      if (this.vocabRows[i].isDirty(this.columnFormat)) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Create data structure representing table at the beginning of the game.
 * @param {*[]} rawVocab vocabulary from JSON
 * @param {number} columnFormat format describing which columns are enabled 
 * (see columnOptions)
 */
export function create(rawVocab, columnFormat) {
  const newVocab = rawVocab.map(rawRow => VocabRow.create(rawRow, columnFormat));
  shuffle(newVocab);
  return new VocabData(newVocab, columnFormat);
}

/** 
 * Shuffle an array using the Fisher-Yates shuffle. 
 * @param {*[]} a array to shuffle (modified in this function)
 */
function shuffle(a) {
  const n = a.length;
  for (let i=0; i<n-1; i++) {
    const j = Math.floor(Math.random() * (n - i)) + i;
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
}