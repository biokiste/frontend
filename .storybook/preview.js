import { addParameters, addDecorator } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import "../src/styles/tailwind.css";

import fetchMock from "fetch-mock";
fetchMock.config.overwriteRoutes = true;

addDecorator(withA11y);
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});
