import {convertPinyin} from '../helpers/PinyinHelpers';

/**
 * Represents one cell in the vocabulary table.
 */
export class VocabCell {
  /**
   * @param {string} display what to show to user
   * @param {string[]} accept list of values that can be marked as correct
   * @param {string} userAnswer what the user has written in the cell. 
   * Empty if none written yet, null if filled in by application.
   */
  constructor(display, accept, userAnswer) {
    this.display = display;
    this.accept = accept;
    this.userAnswer = userAnswer;
  }

  /**
   * Copy vocab cell.
   */
  copy() {
    return new VocabCell(this.display, this.accept, this.userAnswer);
  }

  /**
   * Create a new vocab cell in which userAnswer is null if the correct
   * answer was submitted.
   * @param {number} col 0 for hanzi, 1 for pinyin, and 2 for english
   */
  copyAndFillInIfCorrect(col) {
    const userAnswer = this.userAnswer;
    const correct = this.accept.findIndex(value => isCorrect(value, userAnswer, col)) !== -1;
    return new VocabCell(this.display, this.accept, correct ? null : userAnswer);  
  }
}

/**
 * Creates a new vocabulary cell data structure from JSON.
 * @param {*} rawCell object containing "display" property and "accept" list.
 * The "display" string is what to show the user if the answer is filled
 * in, and "accept" is a list of answers a user can enter to be correct.
 * @param {string} userAnswer user's answer; null if computer filled in
 */
export function create(rawCell, userAnswer) {
  return new VocabCell(rawCell.display, rawCell.accept || [rawCell.display], userAnswer);
}

/**
 * Returns whether a user entered a correct answer in a table cell.
 * @param {string} acceptableAnswer answer accepted by quiz
 * @param {string} userAnswer user's answer
 * @param {number} col 0 for hanzi, 1 for pinyin, and 2 for english
 */
function isCorrect(acceptableAnswer, userAnswer, col) {
  if (typeof(acceptableAnswer) !== "string" || typeof(userAnswer) !== "string") {
    return false;
  }

  acceptableAnswer = acceptableAnswer.trim().toLocaleLowerCase();
  userAnswer = userAnswer.trim().toLocaleLowerCase();
  
  if (col === 1) {
    acceptableAnswer = convertPinyin(acceptableAnswer);
    userAnswer = convertPinyin(userAnswer);
  }

  return acceptableAnswer === userAnswer;
}