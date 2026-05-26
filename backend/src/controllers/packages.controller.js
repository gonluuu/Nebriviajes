const { makeSearch, makeCreate } = require("./catalog.controller");
const { makeGetById } = require("./catalog.controller");
module.exports = { searchPackages: makeSearch("packages"), getPackageById: makeGetById("packages"), createPackage: makeCreate("packages") };
