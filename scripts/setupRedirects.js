const fs = require("fs").promises;

// TODO: Add to config
const API_PRODUCTION = "https://biokiste.uber.space";
const API_STAGING = "https://stage.biokiste.uber.space";

const API =
  process.env.NODE_ENV === "production" ? API_PRODUCTION : API_STAGING;

async function setUpRedirects() {
  let file;
  try {
    file = await fs.open("./build/_redirects", "w+");
    await file.writeFile(`/api/* ${API}/api/:splat 200`);
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
  }
}

setUpRedirects();
