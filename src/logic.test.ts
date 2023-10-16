import { readFileSync } from "fs";
import {
  addLetter,
  canPlay,
  createBoard,
  findSolution,
  isLegalBoard,
} from "./logic";
import { Board, isLetter } from "./types";
import { resolve } from "path";

describe("logic", () => {
  test("createBoard", () => {
    expect(createBoard("a")).toEqual({
      sequence: ["a"],
      top: new Set(["a"]),
      left: new Set(),
      right: new Set(),
      bottom: new Set(),
    });
  });

  test("isLegalBoard", () => {
    expect(isLegalBoard(createBoard("a"))).toBe(true);
    expect(isLegalBoard(false)).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "b", "c"],
        top: new Set(["a", "b"]),
        left: new Set(),
        right: new Set(),
        bottom: new Set(),
      })
    ).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "c"],
        top: new Set(["a", "b"]),
        left: new Set(),
        right: new Set(),
        bottom: new Set(),
      })
    ).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "b"],
        top: new Set(["a", "b"]),
        left: new Set(),
        right: new Set(),
        bottom: new Set(),
      })
    ).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "b", "a", "c"],
        top: new Set(["a"]),
        left: new Set(["b"]),
        right: new Set(["c"]),
        bottom: new Set(),
      })
    ).toBe(true);

    expect(
      isLegalBoard({
        sequence: "exhaustionewer".split(""),
        top: new Set("tue".split("")),
        left: new Set("aiw".split("")),
        right: new Set("xso".split("")),
        bottom: new Set("nhr".split("")),
      })
    ).toBe(true);
  });

  describe("addLetter", () => {
    test("simple case", () => {
      const a = createBoard("a");
      const b = addLetter(a, "b");
      expect(b).toHaveLength(3);

      const c = addLetter(b, "c");
      expect(c).toHaveLength(b.length * 3);
    });

    test("cycle", () => {
      const a = createBoard("a");
      const b = addLetter(a, "b");
      const cycle = addLetter(b, "a");
      expect(cycle).toHaveLength(3);
      const c = addLetter(cycle, "c");
      expect(c).toHaveLength(b.length * 3);
    });
  });

  test("creating", () => {
    const [first, ...rest] = "exha".split("").filter(isLetter);
    let boards = [createBoard(first)];
    for (const next of rest) {
      boards = addLetter(boards, next);
    }
    expect(boards).toHaveLength(3 * 3 * 3);
  });

  test("impossible board", () => {
    const [first, ...rest] = "abacadaeafagahaiajakal"
      .split("")
      .filter(isLetter);
    expect(new Set([first, ...rest]).size).toBe(12);
    let boards = [createBoard(first)];
    for (const next of rest) {
      boards = addLetter(boards, next);
    }
    expect(boards).toHaveLength(0);
  });

  test("NYT game", () => {
    const [first, ...rest] = "exhaustionnewer".split("").filter(isLetter);
    expect(new Set([first, ...rest]).size).toBe(12);
    let boards = [createBoard(first)];
    for (const next of rest) {
      const nextBoards = addLetter(boards, next);
      if (nextBoards.length === 0) {
        console.warn(boards);
        throw new Error(`failed at ${next}`);
      }
      boards = nextBoards;
    }
    expect(boards).toHaveLength(7758);
  });

  test("Adding w", () => {
    expect(
      addLetter(
        {
          sequence: "exhaustionne".split("").filter(isLetter),
          sideA: new Set("eut".split("").filter(isLetter)),
          sideB: new Set("ai".split("").filter(isLetter)),
          sideC: new Set("xso".split("").filter(isLetter)),
          sideD: new Set("nh".split("").filter(isLetter)),
        },
        "w"
      )
    ).toHaveLength(2);
  });
});

describe("solving", () => {
  test("canPlay", () => {
    const board: Board = {
      sequence: "skåleegentliggrave".split("").filter(isLetter),
      sideA: new Set("eså".split("").filter(isLetter)),
      sideB: new Set("lkg".split("").filter(isLetter)),
      sideC: new Set("ain".split("").filter(isLetter)),
      sideD: new Set("rtv".split("").filter(isLetter)),
    };

    expect(canPlay(board, "skåle".split("").filter(isLetter))).toBe(true);
    expect(canPlay(board, "seler".split("").filter(isLetter))).toBe(false);
  });

  describe("with word list", () => {
    const words = (() => {
      const contents = readFileSync(
        resolve(__dirname, "../wordlist/fullformsliste.txt"),
        { encoding: "latin1" }
      ).toString();
      return contents
        .split("\n")
        .map((line) => {
          const columns = line.split("\t");
          return columns[2];
        })
        .filter(Boolean)
        .filter((word) => word.length > 2)
        .filter((word) => {
          for (let i = 1; i < word.length; i += 1) {
            if (word[i] === word[i - 1]) {
              return false;
            }
          }
          return true;
        })
        .filter((word) => word.split("").every(isLetter));
    })();

    test("solving", () => {
      const dict = [
        "enveisgater",
        "årstilvekstene",
        "avsetningsvilkår",
        "skåle",
        "egentlig",
        "grave",
      ];

      const board = {
        sequence: "skåleegentliggrave".split("").filter(isLetter),
        sideA: new Set("eså".split("").filter(isLetter)),
        sideB: new Set("lkg".split("").filter(isLetter)),
        sideC: new Set("ain".split("").filter(isLetter)),
        sideD: new Set("rtv".split("").filter(isLetter)),
      } satisfies Board;

      const solution = findSolution(dict, board);
      expect(solution).toHaveLength(2);
    });

    test("dnågirktyaes", () => {
      const dict = ["nedgangsåra", "artskrysningen"] as const;

      const board = {
        sequence: dict.join("").split("").filter(isLetter),
        sideA: new Set("dnå".split("").filter(isLetter)),
        sideB: new Set("aes".split("").filter(isLetter)),
        sideC: new Set("gir".split("").filter(isLetter)),
        sideD: new Set("kty".split("").filter(isLetter)),
      } satisfies Board;

      expect(new Set(dict.join("").split("")).size).toBe(12);

      expect(canPlay(board, dict[0].split("").filter(isLetter))).toBe(true);
      expect(canPlay(board, dict[1].split("").filter(isLetter))).toBe(true);

      const solution = findSolution(dict, board);
      expect(solution).toHaveLength(2);
    });
  });
});
