const direct = require("pdf-parse");
const def = direct && direct.default;
console.log("typeof direct:", typeof direct);
console.log("typeof direct.default:", typeof def);
console.log("direct:", direct);
console.log("direct.default:", def);
