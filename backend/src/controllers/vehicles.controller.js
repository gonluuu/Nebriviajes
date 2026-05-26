const { makeSearch, makeGetById, makeCreate } = require("./catalog.controller");
module.exports = { searchVehicles: makeSearch("vehicles"), getVehicleById: makeGetById("vehicles"), createVehicle: makeCreate("vehicles") };
