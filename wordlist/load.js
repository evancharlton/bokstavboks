const fs = require("fs");
const readline = require("readline");
const path = require("path");

const removedWords = (() => {
  const removed = new Set();
  if (process.env.REMOVED_WORDS) {
    const wordsArray = require(process.env.REMOVED_WORDS);
    wordsArray.forEach((word) => removed.add(word));
  }
  return removed;
})();

const ALPHABET = new Set("abcdefghijklmnopqrstuvwxyzæøå".split(""));

const isValidLetter = (letter) => {
  return letter.toLocaleLowerCase() === letter && ALPHABET.has(letter);
};

const ADJACENT_LETTERS = /(.)\1+/;

const loadWords = (file) => {
  return new Promise((resolve, reject) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, file), {
        encoding: "latin1",
      }),
      console: false,
    });

    let lines = 0;
    const words = new Set();
    const onLine = (line) => {
      if (lines++ === 0) {
        return;
      }

      const word = line.split("\t")[2];
      if (removedWords.has(word)) {
        return;
      }

      if (ADJACENT_LETTERS.test(word)) {
        return;
      }

      const letters = word.split("");
      const unique = new Set(word.split(""));
      if (unique.size > 12) {
        return;
      }

      if (unique.size < 3) {
        return;
      }

      if (!letters.every(isValidLetter)) {
        return;
      }

      words.add(word);
    };

    const onClose = () => {
      resolve([...words]);
    };

    readInterface.on("line", onLine);
    readInterface.on("close", onClose);
  });
};

const leastOverlapWith = (word) => {
  return (a, b) => {
    const aLetters = new Set(a.split(""));
    const bLetters = new Set(b.split(""));

    for (let i = 0; i < word.length; i += 1) {
      aLetters.delete(word[i]);
      bLetters.delete(word[i]);
    }
    return bLetters.size - aLetters.size;
  };
};

loadWords("fullformsliste.txt")
  .then((words) => {
    console.log(words.length);
    const letters = new Map();
    words.forEach((w) => {
      letters.set(w, new Set(w.split("")).size);
    });

    function* chainGenerator(chain) {
      if (chain.length > 3) {
        return;
      }

      const lettersCount = new Set(chain.join("").split("")).size;
      if (lettersCount === 12) {
        yield chain;
      }

      if (lettersCount > 12) {
        return;
      }

      const word = chain[chain.length - 1];
      const count = letters.get(word);
      const end = word[word.length - 1];
      const existingWords = new Set(chain);
      const possibleNext = words
        .filter(
          (w) =>
            !existingWords.has(w) &&
            w[0] === end &&
            letters.get(w) <= 12 - count
        )
        .sort(leastOverlapWith(word));
      for (const next of possibleNext) {
        yield* chainGenerator([...chain, next]);
      }
    }

    const gen = chainGenerator([words[0]]);
    const chains = new Set();
    while (!gen.done) {
      const chain = gen.next().value;
      const letters = [...new Set(chain.join("").split(""))].sort().join("");
      if (!chains.has(letters)) {
        console.log(letters, `->`, chain.join(" + "));
        chains.add(letters);
      }
    }
  })
  .then((out) => console.log(out))
  .catch((e) => {
    console.warn(e);
    process.exit(1);
  });
