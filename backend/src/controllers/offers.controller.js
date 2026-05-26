const { makeSearch, makeCreate, makeGetById } = require("./catalog.controller");
module.exports = { searchOffers: makeSearch("offers"), getOfferById: makeGetById("offers"), createOffer: makeCreate("offers") };
