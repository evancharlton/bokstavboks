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

      if (unique.size < 2) {
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

Promise.all([
  loadWords("fullformsliste.txt").then((words) => {
    const folder = path.resolve(path.join(__dirname, "..", "public", "nb"));
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    fs.writeFileSync(
      path.resolve(path.join(folder, "words.json")),
      JSON.stringify(words, null, 2)
    );
    return words;
  }),

  loadWords("fullformer_2012.txt").then((words) => {
    const folder = path.resolve(path.join(__dirname, "..", "public", "nn"));
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    fs.writeFileSync(
      path.resolve(path.join(folder, "words.json")),
      JSON.stringify(words, null, 2)
    );
    return words;
  }),
]).then(([nb, nn]) => {
  const ordbank = new Set([...nb, ...nn]);

  // Load the "real" data sets
  const usage = [
    require("./2019_bokelskere/2019_bokelskere.json")
      .map(({ text }) =>
        text
          .toLocaleLowerCase()
          .replace(/[\s]+/g, " ")
          .replace(/[^abcdefghijklmnopqrstuvwxyzåæø ]/g, "")
          .replace(/ +/g, " ")
          .split(" ")
          .filter((w) => w.length > 1)
      )
      .flat(),
  ];

  const knownWords = new Set();
  usage.forEach((words) => {
    words
      .filter((word) => ordbank.has(word))
      .forEach((word) => {
        knownWords.add(word);
      });
  });

  const folder = path.resolve(path.join(__dirname, "..", "public", "known"));
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  fs.writeFileSync(
    path.resolve(path.join(folder, "words.json")),
    JSON.stringify([...knownWords].sort(), null, 2)
  );
});
