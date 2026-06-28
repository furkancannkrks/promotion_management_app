import { describe, expect, it } from "vitest";

import { validateEndDate, validateName, validateValue } from "./validationUtils";

describe("validationUtils", () => {
  it("returns invalid when percentage_off value is greater than 100", () => {
    expect(validateValue(101, "percentage_off")).toEqual({
      value: "Percentage discount cannot exceed 100",
    });
  });

  it("returns valid when percentage_off value is 100", () => {
    expect(validateValue(100, "percentage_off")).toEqual({});
  });

  it("returns invalid when end date is before start date", () => {
    expect(validateEndDate("2026-06-15", "2026-06-14")).toEqual({
      endDate: "End date must be after start date",
    });
  });

  it("returns valid when end date is the same as start date", () => {
    expect(validateEndDate("2026-06-15", "2026-06-15")).toEqual({});
  });

  it("returns invalid when name is empty", () => {
    expect(validateName("")).toEqual({
      name: "Name is required",
    });
  });
});
