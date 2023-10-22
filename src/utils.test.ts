import { normalizeId } from "./utils";

describe("utils", () => {
  describe("normalizeId", () => {
    it("works", () => {
      expect(normalizeId("bnraeodgvikt")).toEqual("aeobnrdgvikt");
    });
  });
});
