const express = require("express");

const router = express.Router();

const {
    getFavorites,
    addFavorite,
    removeFavorite,
} = require("../controllers/favorites.controller");
const { protect } = require("../middlewares/auth.middleware");

// Proteger todas las rutas
router.use(protect);

router.route("/").get(getFavorites).post(addFavorite);
router.route("/:id").delete(removeFavorite);

module.exports = router;
