const express = require("express");
const router = express.Router();

const { getAdminStats, listUsers, deleteUser } = require("../controllers/admin.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

router.use(requireAuth, requireAdmin);

router.get("/stats", getAdminStats);
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
