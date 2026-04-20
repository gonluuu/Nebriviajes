const Favorite = require("../models/favorites.model");

// GET /api/favoritos
async function getFavorites(req, res, next) {
    try {
        const favorites = await Favorite.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(favorites);
    } catch (err) {
        next(err);
    }
}

// POST /api/favoritos
async function addFavorite(req, res, next) {
    try {
        const { itemType, itemId, title, subtitle, price, imageUrl, linkUrl } = req.body;
        if (!itemType || !itemId) {
            return res.status(400).json({ message: "Faltan datos obligatorios (itemType, itemId)" });
        }

        const newFavorite = await Favorite.create({
            user: req.user.id,
            itemType,
            itemId,
            title,
            subtitle,
            price,
            imageUrl,
            linkUrl
        });

        res.status(201).json(newFavorite);
    } catch (err) {
        // Error de duplicidad de Mongoose
        if (err.code === 11000) {
            return res.status(400).json({ message: "Este elemento ya está en favoritos" });
        }
        next(err);
    }
}

// DELETE /api/favoritos/:id
// Se espera que :id sea el itemId original para facilitar la eliminación desde el catálogo
async function removeFavorite(req, res, next) {
    try {
        const { id } = req.params;
        const result = await Favorite.findOneAndDelete({ user: req.user.id, itemId: id });
        if (!result) {
            return res.status(404).json({ message: "Favorito no encontrado" });
        }
        res.json({ message: "Favorito eliminado", id });
    } catch (err) {
        next(err);
    }
}

module.exports = { getFavorites, addFavorite, removeFavorite };
