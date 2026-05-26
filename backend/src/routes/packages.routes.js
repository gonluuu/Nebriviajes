const express = require("express");
const router = express.Router();
const { searchPackages, getPackageById, createPackage } = require("../controllers/packages.controller");
router.get("/", searchPackages);
router.get("/:id", getPackageById);
router.post("/", createPackage);
module.exports = router;
