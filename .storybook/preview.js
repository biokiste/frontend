import { addParameters, addDecorator } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import "../src/styles/tailwind.css";

addDecorator(withA11y);
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});
