const { makeSearch, makeGetById, makeCreate } = require("./catalog.controller");
module.exports = { searchTrains: makeSearch("trains"), getTrainById: makeGetById("trains"), createTrain: makeCreate("trains") };
