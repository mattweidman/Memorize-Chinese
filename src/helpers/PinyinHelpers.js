const basicVowels = ['a', 'e', 'i', 'o', 'u'];

/**
 * Converts different formats of pinyin into a standard comparison string.
 * @param {string} s pinyin string
 */
export function convertPinyin(s) {
  // convert tone numbers into pinyin accents
  for (let i=s.length-1; i>=0; i--) {
    const charNumVal = s.charCodeAt(i) - '0'.charCodeAt(0);
    if (charNumVal >= 1 && charNumVal <= 4) {
      let firstIndex, lastIndex;
      [firstIndex, lastIndex] = findLastVowels(s, i);
      const vowelInsert = convertVowelsToPinyin(s.substring(firstIndex, lastIndex), charNumVal);
      s = s.slice(0, firstIndex) + vowelInsert + s.slice(lastIndex, i) + s.slice(i+1);
    }
  }

  // filter out whitespace and apostrophes
  return s.replace(/[\s']/g, "");
}

/**
 * Finds the last adjacent block of 1-2 vowels in a substring. Returns a list 
 * of 2 containing the index of the first char (inclusive) and the index of 
 * the last char (non-inclusive).
 * @param {string} s 
 * @param {number} i last index in string to search from (non-inclusive)
 * @return {number[]} [first index, last index]
 */
function findLastVowels(s, i) {
  let lastIndex = i-1;
  while (lastIndex >= 0 && !isBasicVowel(s[lastIndex])) lastIndex--;
  lastIndex++;

  let firstIndex = lastIndex;
  if (isBasicVowel(s[lastIndex-1])) firstIndex = lastIndex-1;
  if (isBasicVowel(s[lastIndex-2])) firstIndex = lastIndex-2;

  return [firstIndex, lastIndex];
}

/**
 * Takes a vowel string (1 or 2 vowels) and the tone number and returns a
 * new string with the correct vowel accented.
 * @param {string} s 1 or 2 vowels
 * @param {number} toneNum tone number
 */
function convertVowelsToPinyin(s, toneNum) {
  if (s.length === 1) return convertVowelToPinyin(s, toneNum);

  if (s.length > 2) return s;

  if (!isBasicVowel(s[0]) || !isBasicVowel(s[1])) return s;

  if (s[1] === 'a' || s[1] === 'e') { // ae, ea, ia, ie, oa, oe, ua, ue
    return s[0] + convertVowelToPinyin(s[1], toneNum);
  } else if (s[0] === 'a' || s[0] === 'e') { // ai, ao, au, ei, eo, eu
    return convertVowelToPinyin(s[0], toneNum) + s[1];
  } else if (s[1] === 'i' || s[1] === 'o') { // io, oi, ui, uo
    return s[0] + convertVowelToPinyin(s[1], toneNum);
  } else if (s === 'ou') { // ou
    return convertVowelToPinyin('o', toneNum) + 'u';
  } else if (s === 'iu') { // iu
    return 'i' + convertVowelToPinyin('u', toneNum);
  }

  return s;
}

/**
 * Puts a Pinyin accent on a character by returning a new value.
 * @param {string} c vowel character
 * @param {number} toneNum tone number
 */
function convertVowelToPinyin(c, toneNum) {
  if (toneNum < 1 || toneNum > 4) return c;
  switch (c) {
    case 'a': return ['a', 'ā', 'á', 'ǎ', 'à'][toneNum];
    case 'e': return ['e', 'ē', 'é', 'ě', 'è'][toneNum];
    case 'i': return ['i', 'ī', 'í', 'ǐ', 'ì'][toneNum];
    case 'o': return ['o', 'ō', 'ó', 'ǒ', 'ò'][toneNum];
    case 'u': return ['u', 'ū', 'ú', 'ǔ', 'ù'][toneNum];
    default: return c;
  }
}

function isBasicVowel(c) {
  return basicVowels.indexOf(c) !== -1;
}