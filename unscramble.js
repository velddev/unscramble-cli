var dataset = require("an-array-of-english-words");

let args = process.argv.slice(2);
let flags = args.filter(x => x.startsWith("-"));
let words = args.filter(x => !flags.includes(x));

let debug = false;
let indexedDataSet;

handleFlags(flags);
function handleFlags(f) {
  if (f.includes('-d')) {
    debug = true;
  }
}

function logDebug(...args) {
  if (debug) {
    console.log(args);
  }
}

function indexWord(word) {
  let chars = word.toLowerCase().split('');
  let result = {
    _original: word
  };
  for (var char of chars) {
    if (!result[char]) {
      result[char] = 1;
    } else {
      result[char]++;
    }
  }
  return result;
}

function compareWords(a, b) {
  if (Object.keys(a).length != Object.keys(b).length) {
    return false;
  }

  for (var c of Object.keys(a)) {
    // keys starting with underscore are used for internal metadata.
    if (c.startsWith("_")) {
      continue;
    }

    if (!b[c]) {
      return false;
    }

    if (b[c] != a[c]) {
      return false;
    }
  }
  return true;
}

function resolveWord(word) {
  let startTime = Date.now();

  if (!indexedDataSet) {
    logDebug("first run... indexing words...");
    indexedDataSet = dataset.map(indexWord);
    logDebug("indexed", indexedDataSet.length, "words");
  }

  let indexedWord = indexWord(word);
  let foundWords = indexedDataSet.filter((w) => compareWords(indexedWord, w))

  console.log(foundWords.map(x => x._original).join("\n"));
  logDebug("completed in", (Date.now() - startTime), "ms");
}

for (let word of words) {
  resolveWord(word);
}