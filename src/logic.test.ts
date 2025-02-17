import { readFileSync } from "fs";
import {
  addLetter,
  canPlay,
  createBoard,
  findSolution,
  findSolutionById,
  isLegalBoard,
} from "./logic";
import { Board, isLetter } from "./types";
import { resolve } from "path";

describe("logic", () => {
  test("createBoard", () => {
    expect(createBoard("a")).toEqual({
      sequence: ["a"],
      sideA: new Set(["a"]),
      sideB: new Set(),
      sideC: new Set(),
      sideD: new Set(),
    });
  });

  test("isLegalBoard", () => {
    expect(isLegalBoard(createBoard("a"))).toBe(true);
    expect(isLegalBoard(false)).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "b", "c"],
        sideA: new Set(["a", "b"]),
        sideB: new Set(),
        sideC: new Set(),
        sideD: new Set(),
      }),
    ).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "c"],
        sideA: new Set(["a", "b"]),
        sideB: new Set(),
        sideC: new Set(),
        sideD: new Set(),
      }),
    ).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "b"],
        sideA: new Set(["a", "b"]),
        sideB: new Set(),
        sideC: new Set(),
        sideD: new Set(),
      }),
    ).toBe(false);

    expect(
      isLegalBoard({
        sequence: ["a", "b", "a", "c"],
        sideA: new Set(["a"]),
        sideB: new Set(["b"]),
        sideC: new Set(["c"]),
        sideD: new Set(),
      }),
    ).toBe(true);

    expect(
      isLegalBoard({
        sequence: "exhaustionewer".split(""),
        sideA: new Set("tue".split("")),
        sideB: new Set("aiw".split("")),
        sideC: new Set("xso".split("")),
        sideD: new Set("nhr".split("")),
      }),
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
        "w",
      ),
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

  // Skip these by default because they're slow.
  describe.skip("with word list", () => {
    const words = (() => {
      const contents = readFileSync(
        resolve(__dirname, "../wordlist/fullformsliste.txt"),
        { encoding: "latin1" },
      ).toString();
      const words = contents
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
      return [...new Set(words)].sort();
    })();

    test("solving", async () => {
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

      const solution = await findSolution(dict, board);
      expect(solution).toHaveLength(2);
    });

    test("dnågirktyaes", async () => {
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

      const solution = await findSolution(dict, board);
      expect(solution).toHaveLength(2);
    });

    test(
      "akynorgsteil",
      async () => {
        const solution = await findSolutionById(
          words,
          "akynorgsteil",
          null as unknown as AbortSignal,
        );
        expect(solution).toHaveLength(2);
        expect(solution[0][solution[0].length - 1]).toEqual(solution[1][0]);
      },
      20 * 1000,
    );

    test("aejorvbmtinp", async () => {
      const solution = await findSolutionById(
        words ?? ["evertebrat", "tjonete", "empatiene"],
        "aejorvbmtinp",
        null as unknown as AbortSignal,
      );
      expect(solution).toHaveLength(2);
    });
  });
});
