const { makeSearch, makeGetById, makeCreate, makeUpdate, makeDelete } = require("./catalog.controller");
module.exports = { searchHotels: makeSearch("hotels"), getHotelById: makeGetById("hotels"), createHotel: makeCreate("hotels"), updateHotel: makeUpdate("hotels"), deleteHotel: makeDelete("hotels") };
