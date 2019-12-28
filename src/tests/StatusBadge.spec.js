import React from "react";
import { render, waitForDomChange } from "@testing-library/react";

import StatusBadge from "../components/StatusBadge";

describe("Status Badge", () => {
  it("shows default status", () => {
    const { container } = render(<StatusBadge name="Test API" />);
    expect(container.firstChild).toHaveClass("bg-gray-200");
  });
  it("shows connection error", async () => {
    fetch.mockReject(new Error("Error"));
    const { container } = render(
      <StatusBadge url="http://test.com/api" name="Test API" />
    );
    await waitForDomChange({ container });
    expect(container.firstChild).toHaveClass("bg-red-200");
  });
  it("shows success", async () => {
    fetch.mockResponse("ok");
    const { container } = render(
      <StatusBadge url="http://test.com/api" name="Test API" />
    );
    expect(container.firstChild).toHaveClass("bg-yellow-200");
    await waitForDomChange({ container });
    expect(container.firstChild).toHaveClass("bg-green-200");
  });
});
