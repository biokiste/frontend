import { configure, addDecorator, addParameters } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import "../src/styles/tailwind.css";

configure(require.context("../src", true, /\.stories\.js$/), module);
addDecorator(withA11y);
addParameters({ viewport: { viewports: INITIAL_VIEWPORTS } });
