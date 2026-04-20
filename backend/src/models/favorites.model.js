const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        itemType: {
            type: String,
            required: true,
            enum: ["flight", "hotel", "vehicle", "cruise", "train", "package", "offer"],
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            default: ""
        },
        subtitle: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            default: 0
        },
        imageUrl: {
            type: String,
            default: ""
        },
        linkUrl: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true,
    }
);

// Evitar que el usuario guarde el mismo item varias veces
FavoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
