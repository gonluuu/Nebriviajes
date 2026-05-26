const { makeSearch, makeGetById, makeCreate } = require("./catalog.controller");
module.exports = { searchFlights: makeSearch("flights"), getFlightById: makeGetById("flights"), createFlight: makeCreate("flights") };
