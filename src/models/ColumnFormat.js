export const columnOptions = {
  hanzi: 1,
  pinyin: 2,
  english: 4
};

export const defaultColumnFormat = 7;

export function showHanzi(columnFormat) {
  return columnFormat & columnOptions.hanzi ? true : false;
}

export function showPinyin(columnFormat) {
  return columnFormat & columnOptions.pinyin ? true : false;
}

export function numCols(columnFormat) {
  return columnFormat === 7 ? 3 : 2;
}