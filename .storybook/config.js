import { configure, addDecorator } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";

import "../src/styles/tailwind.css";

configure(require.context("../src", true, /\.stories\.js$/), module);
addDecorator(withA11y);
addParameters({ viewport: { viewports: newViewports } });
