import { addLetter, createBoard, isLegalBoard } from "./logic";
import { isLetter } from "./types";

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
          top: new Set("eut".split("").filter(isLetter)),
          left: new Set("ai".split("").filter(isLetter)),
          right: new Set("xso".split("").filter(isLetter)),
          bottom: new Set("nh".split("").filter(isLetter)),
        },
        "w"
      )
    ).toHaveLength(2);
  });
});
