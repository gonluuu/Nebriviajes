const express = require("express");
const router = express.Router();

const {
  searchPackages,
  createPackage,
} = require("../controllers/packages.controller");

router.get("/", searchPackages);
router.post("/", createPackage);

module.exports = router;
