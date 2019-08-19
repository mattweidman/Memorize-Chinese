const columnOptions = {
  RANDOM_HANZI_PINYIN_ENGLISH: 0,
  RANDOM_HANZI_ENGLISH: 1,
  RANDOM_PINYIN_ENGLISH: 2,
  HANZI_TO_ENGLISH: 3,
  PINYIN_TO_ENGLISH: 4,
  ENGLISH_TO_HANZI: 5,
  ENGLISH_TO_PINYIN: 6
};

const columnTitles = {
  0: "Random: Hanzi, Pinyin, and English",
  1: "Random: Hanzi and English",
  2: "Random: Pinyin and English",
  3: "Hanzi to English",
  4: "Pinyin to English",
  5: "English to Hanzi",
  6: "English to Pinyin"
}

export const defaultColumnFormat = columnOptions.RANDOM_HANZI_PINYIN_ENGLISH;

export function getColumnOptions() {
  return Object.values(columnOptions);
}

export function showHanzi(columnFormat) {
  switch (columnFormat) {
    case columnOptions.RANDOM_HANZI_PINYIN_ENGLISH:
    case columnOptions.RANDOM_HANZI_ENGLISH:
    case columnOptions.HANZI_TO_ENGLISH:
    case columnOptions.ENGLISH_TO_HANZI:
      return true;
    default: 
      return false;
  }
}

export function showPinyin(columnFormat) {
  switch (columnFormat) {
    case columnOptions.RANDOM_HANZI_PINYIN_ENGLISH:
    case columnOptions.RANDOM_PINYIN_ENGLISH:
    case columnOptions.PINYIN_TO_ENGLISH:
    case columnOptions.ENGLISH_TO_PINYIN:
      return true;
    default:
      return false;
  }
}

export function numCols(columnFormat) {
  switch(columnFormat) {
    case columnOptions.RANDOM_HANZI_PINYIN_ENGLISH:
      return 3;
    default:
      return 2;
  }
}

export function getColumnTitle(columnFormat) {
  return columnTitles[columnFormat];
}

/**
 * Given the column format, returns a list of 3 strings, one for each cell in 
 * a row (hanzi, pinyin, english). A cell is assigned undefined if the column
 * does not exist, null if it should be filled in by the computer, and the 
 * empty string if it should begin as a blank text input.
 * @param {number} columnFormat column format
 */
export function getInitialRowFormat(columnFormat) {
  switch (columnFormat) {
    case columnOptions.RANDOM_HANZI_ENGLISH:
      switch (Math.floor(Math.random() * 2)) {
        case 0: return [null, undefined, ""];
        default: return ["", undefined, null];
      }
    case columnOptions.RANDOM_PINYIN_ENGLISH:
      switch (Math.floor(Math.random() * 2)) {
        case 0: return [undefined, null, ""];
        default: return [undefined, "", null];
      }
    case columnOptions.HANZI_TO_ENGLISH:
      return [null, undefined, ""];
    case columnOptions.PINYIN_TO_ENGLISH:
      return [undefined, null, ""];
    case columnOptions.ENGLISH_TO_HANZI:
      return ["", undefined, null];
    case columnOptions.ENGLISH_TO_PINYIN:
      return [undefined, "", null];
    default:
      const ans = ["", "", ""];
      ans[Math.floor(Math.random() * 3)] = null;
      return ans;
  }
}