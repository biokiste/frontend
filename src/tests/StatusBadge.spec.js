import React from "react";
import { render } from "@testing-library/react";

import StatusBadge from "../components/StatusBadge";

test("render without failure", () => {
  const { container } = render(<StatusBadge />);
  expect(container).toBeInTheDocument();
});
