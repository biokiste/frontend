import { getColumnVisibility, getColumnWidth } from "../utils/tailwind";

describe("utils.tailwind", () => {
  describe("getColumnVisibility()", () => {
    it("returns empty string", () => {
      const columns = ["valueKey"];
      const value = getColumnVisibility(columns);
      expect(value).toBe("");
    });
    it("returns visibility breakpoints", () => {
      const columns = {
        visible: ["valueKey1"],
        sm: ["valueKey2"],
      };
      expect(getColumnVisibility(columns, "valueKey1")).toBe(`visible`);
      expect(getColumnVisibility(columns, "valueKey2")).toBe(
        `invisible sm:visible`
      );
    });
  });
  describe("getColumnWidth()", () => {
    it("returns width based on number of columns", () => {
      const columns = ["valueKey1", "valueKey2", "valueKey3"];
      const value = getColumnWidth(columns, "valueKey1");
      expect(value).toBe(`w-1/3`);
    });
    it("returns width based breakpoints", () => {
      const columns = {
        visible: ["valueKey1"],
        sm: ["valueKey2", "valueKey3"],
        md: ["valueKey4"],
      };
      expect(getColumnWidth(columns, "valueKey1")).toBe(
        `w-full sm:w-1/3 md:w-1/4`
      );
      expect(getColumnWidth(columns, "valueKey2")).toBe(
        `w-0 sm:w-1/3 md:w-1/4`
      );
      expect(getColumnWidth(columns, "valueKey4")).toBe(`w-0 md:w-1/4`);
      columns.visible = [...columns.visible, "valueKey5"];
      expect(getColumnWidth(columns, "valueKey1")).toBe(
        `w-1/2 sm:w-1/4 md:w-1/5`
      );
    });
  });
});
