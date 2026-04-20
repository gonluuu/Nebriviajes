const Reserva = require("../models/reservas.model");

const Hotel = require("../models/hotels.model");
const Flight = require("../models/flights.model");
const Train = require("../models/trains.model");
const Vehicle = require("../models/vehicles.model");
const Cruise = require("../models/cruises.model");
const Package = require("../models/packages.model");
const Offer = require("../models/offers.model");
const mongoose = require("mongoose");

function getModelByType(type) {
  const map = {
    hotel: Hotel,
    flight: Flight,
    train: Train,
    vehicle: Vehicle,
    cruise: Cruise,
    package: Package,
    offer: Offer,
  };
  return map[type];
}

// GET /api/reservas
async function listReservas(req, res, next) {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const reservas = await Reserva.find(query).sort({ createdAt: -1 });
    res.json({ count: reservas.length, results: reservas });
  } catch (err) {
    next(err);
  }
}

// POST /api/reservas
// body: { type: "hotel"|"flight"|"train"|"vehicle"|"cruise"|"package"|"offer", itemId: "..." }
async function createReserva(req, res, next) {
  try {
    const { type, itemId } = req.body;

    if (!type || !itemId) {
      return res.status(400).json({ message: "type e itemId son obligatorios" });
    }

    const Model = getModelByType(type);
    if (!Model) {
      return res.status(400).json({ message: "type no válido" });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "itemId no válido" });
    }

    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "No existe ese elemento" });
    }

    // (Opcional) si algún día metes middleware JWT, aquí podrías sacar req.user.id
    const userId = null;

    const reserva = await Reserva.create({
      type,
      originalId: item._id,
      snapshot: item.toObject(),
      userId,
    });

    // BORRAR del catálogo (colección original)
    await Model.deleteOne({ _id: item._id });

    res.status(201).json(reserva);
  } catch (err) {
    next(err);
  }
}

// POST /api/reservas/:id/restore
// Restaura una reserva al catálogo original (vuelve a crear el item en su colección)
// y elimina el registro de `reservas`.
async function restoreReserva(req, res, next) {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const Model = getModelByType(reserva.type);
    if (!Model) {
      return res.status(400).json({ message: "type no válido" });
    }

    // Si ya existe en el catálogo, evitamos duplicados
    const existing = await Model.findById(reserva.originalId);
    if (existing) {
      // Eliminamos la reserva para “volver a estado original” (ya está restaurado)
      await Reserva.deleteOne({ _id: reserva._id });
      return res.json({ message: "El item ya existía. Reserva eliminada.", restored: existing });
    }

    // Reconstruir el documento desde el snapshot
    const data = { ...(reserva.snapshot || {}) };

    // Usar el mismo _id original para que los enlaces vuelvan a funcionar
    data._id = reserva.originalId;

    // Limpieza de campos internos si vinieran en snapshot
    delete data.__v;

    // Reinsertar en colección original
    const restored = await Model.create(data);

    // Eliminar la reserva
    await Reserva.deleteOne({ _id: reserva._id });

    res.json({ message: "Restaurado", restored });
  } catch (err) {
    next(err);
  }
}

module.exports = { listReservas, createReserva, restoreReserva };
