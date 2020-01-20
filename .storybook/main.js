module.exports = {
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions/register",
    "@storybook/addon-links/register",
    "@storybook/addon-viewport/register",
    "@storybook/addon-a11y/register"
  ],
  stories: ["../src/**/*.stories.js"]
};
