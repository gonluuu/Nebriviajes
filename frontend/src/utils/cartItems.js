export function formatType(type) {
  const map = {
    hotel: "Hotel",
    flight: "Vuelo",
    train: "Tren",
    vehicle: "Vehiculo",
    cruise: "Crucero",
    package: "Paquete",
    offer: "Oferta",
  };
  return map[type] || type;
}

export function buildCartItem({ type, item, path }) {
  const id = item?._id || item?.id;

  const titleByType = {
    hotel: item?.name || item?.title || "Hotel",
    flight:
      item?.title ||
      `${item?.origin || ""} - ${item?.destination || ""}`.trim() ||
      "Vuelo",
    train:
      item?.title ||
      `${item?.origin || ""} - ${item?.destination || ""}`.trim() ||
      "Tren",
    vehicle: item?.model || item?.name || item?.type || "Vehiculo",
    cruise: item?.name || item?.title || item?.route || "Crucero",
    package: item?.title || item?.name || "Paquete",
    offer: item?.title || item?.name || "Oferta",
  };

  const subtitleByType = {
    hotel: item?.city || item?.destination || "",
    flight: item?.airline || item?.duration || "",
    train: item?.date || item?.duration || "",
    vehicle: item?.city || item?.date || "",
    cruise:
      item?.origin && item?.destination
        ? `${item.origin} - ${item.destination}`
        : item?.destination || "",
    package: item?.destination || item?.description || "",
    offer: item?.destination || item?.description || "",
  };

  return {
    type,
    itemId: id,
    title: titleByType[type],
    subtitle: subtitleByType[type],
    price: item?.price ?? item?.priceFrom ?? item?.pricePerPerson ?? item?.priceCurrent ?? item?.totalPrice ?? 0,
    imageUrl: item?.imageUrl || item?.image || "",
    linkUrl: id ? `${path}/${id}` : path,
  };
}
