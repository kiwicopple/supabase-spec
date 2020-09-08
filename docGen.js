const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "/gotrue-doc/openref.yaml");
const OUTPUT_DIR = path.join(__dirname, "/gotrue");

try {
  const doc = yaml.safeLoad(fs.readFileSync(INPUT_FILE, "utf8"));
  console.log(doc);

  fs.writeFile(OUTPUT_DIR + "test", doc, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }); 

} catch (e) {
  console.log(e);
}
