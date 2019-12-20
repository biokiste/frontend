import { configure } from "@storybook/react";

import "../src/styles/tailwind.css";

configure(require.context("../src", true, /\.stories\.js$/), module);
