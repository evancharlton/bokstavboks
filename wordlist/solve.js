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

if (!process.argv[2]) {
  console.error("Missing input. Usage: node solve <input>");
  process.exit(1);
}

{
  const letters = new Set(
    process.argv[2]
      .split("")
      .filter((v) => {
        const code = v.charCodeAt(0);
        if (code < "a".charCodeAt(0) || code > "z".charCodeAt(0)) {
          return false;
        }
        return true;
      })
      .map((v) => v.toLocaleLowerCase())
  );
  if (letters.size !== 12) {
    console.error(`Exactly 12 unique letters needed - got: ${letters.size}`);
    console.error(letters);
    process.exit(1);
  }
}

const letters = process.argv[2];

const subset = (...ix) => {
  return ix.map((i) => letters[i]);
};

const grid = {
  [letters[0]]: subset(3, 4, 5, 6, 7, 8, 9, 10, 11),
  [letters[1]]: subset(3, 4, 5, 6, 7, 8, 9, 10, 11),
  [letters[2]]: subset(3, 4, 5, 6, 7, 8, 9, 10, 11),
  [letters[3]]: subset(0, 1, 2, 6, 7, 8, 9, 10, 11),
  [letters[4]]: subset(0, 1, 2, 6, 7, 8, 9, 10, 11),
  [letters[5]]: subset(0, 1, 2, 6, 7, 8, 9, 10, 11),
  [letters[6]]: subset(0, 1, 2, 3, 4, 5, 9, 10, 11),
  [letters[7]]: subset(0, 1, 2, 3, 4, 5, 9, 10, 11),
  [letters[8]]: subset(0, 1, 2, 3, 4, 5, 9, 10, 11),
  [letters[9]]: subset(0, 1, 2, 3, 4, 5, 6, 7, 8),
  [letters[10]]: subset(0, 1, 2, 3, 4, 5, 6, 7, 8),
  [letters[11]]: subset(0, 1, 2, 3, 4, 5, 6, 7, 8),
};

// abdegikmnort -> abandoner + riktig + gamben
//
//      0  1  2
//      a  o  t
// 11 i         d 3
// 10 b         e 4
//  9 n         g 5
//      m  r  k
//      8  7  6

loadWords("fullformsliste.txt")
  .then((words) =>
    words.filter(
      (word) =>
        (word[0] === "a" && word.length === 9) ||
        (word[0] === "r" && word.length === 6) ||
        (word[0] === "g" && word.length === 6)
    )
  )
  .then((words) => {
    const trie = {};
    for (const word of words) {
      let node = trie;
      word.split("").forEach((char, i, arr) => {
        if (!node[char]) {
          node[char] = {};
        }
        node = node[char];
        if (i === arr.length - 1) {
          node.word = true;
        }
      });
    }
    return trie;
  })
  .then((trie) => {
    // TODO: Starting from each entry point in the grid, find all the words
    //       which can be created using the layout. Then I guess we start the
    //       process again? Or we keep going until the full grid is completed?
    //       Whichever comes first, I suppose.
  })
  .then((out) => console.log(JSON.stringify(out, null, 2)))
  .catch((e) => {
    console.warn(e);
    process.exit(1);
  });
