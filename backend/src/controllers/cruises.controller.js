const { makeSearch, makeGetById, makeCreate } = require("./catalog.controller");
module.exports = { searchCruises: makeSearch("cruises"), getCruiseById: makeGetById("cruises"), createCruise: makeCreate("cruises") };
