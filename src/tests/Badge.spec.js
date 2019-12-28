import React from "react";
import { render } from "@testing-library/react";
import Badge from "../components/Badge";

describe("Badge", () => {
  it("shows name", () => {
    const name = "test badge";
    const { getByText } = render(<Badge>{name}</Badge>);
    expect(getByText(name)).toBeInTheDocument();
  });
  it("uses color", () => {
    const name = "test badge";
    const color = "red";
    const { container } = render(<Badge color={color}>{name}</Badge>);
    expect(container.firstChild).toHaveClass(`bg-${color}-200`);
  });
});
