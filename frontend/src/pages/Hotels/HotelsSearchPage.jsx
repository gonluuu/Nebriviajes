import { useEffect, useMemo, useState } from "react";
import HotelsSearchBar from "../../components/search/HotelsSearchBar.jsx";
import HotelsFiltersPanel, {
  DEFAULT_HOTELS_FILTERS,
  MAX_DISTANCE_KM,
} from "../../components/search/HotelsFiltersPanel.jsx";
import MapaHotelesNebriViajes from "../../components/search/MapaHotelesNebriViajes.jsx";
import { getHotels } from "../../api/hotels";
import { Link, useLocation } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";

function HotelsSearchPage() {
  const location = useLocation();
  const [filters, setFilters] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    minPrice: "",
    maxPrice: "",
  });

  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_HOTELS_FILTERS);
  const [hotels, setHotels] = useState([]);
  const [viewMode, setViewMode] = useState("list");

  const cleanParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => String(v).trim() !== "")
    );



function shuffle(list) {
  const result = [];

  while (list.length > 0) {
    const randomIndex = Math.floor(Math.random() * list.length);
    result.push(list[randomIndex]);
    list.splice(randomIndex, 1);
  }

  return result;
}

  async function load(nextFilters = filters) {
    const params = cleanParams({
      city: nextFilters.city,
      startDate: nextFilters.checkIn,
      endDate: nextFilters.checkOut,
      minPrice: nextFilters.minPrice,
      maxPrice: nextFilters.maxPrice,
    });

    const data = await getHotels(params);

    const mapped = (data?.results || []).map((h) => ({
      id: h._id,
      name: h.name,
      stars: "★★★",
      city: h.city,
      address: h.address,
      latitude: h.latitude,
      longitude: h.longitude,
      distance: h.address || "Centro",
      price: h.price,
      priceNight: h.price,
      imageUrl: h.imageUrl,
      _type: typeof h.type === "string" ? h.type.toLowerCase() : null,
      _amenities: Array.isArray(h.amenities)
        ? h.amenities.map((a) => String(a).toLowerCase())
        : null,
      _distanceKm: typeof h.distanceFromCenter === "number"
        ? h.distanceFromCenter
        : typeof h.distanceKm === "number"
          ? h.distanceKm
          : null,
      _rating: typeof h.rating === "number" ? h.rating : null,
      _stars: typeof h.stars === "number" ? h.stars : null,
    }));

    setHotels(shuffle(mapped));
  }

  useEffect(() => {

    const prefill = location?.state?.prefill;
    const autoSearch = location?.state?.autoSearch;

    if (prefill && typeof prefill === "object") {
      setFilters((f) => ({
        ...f,
        city: prefill.city ?? f.city,
        checkIn: prefill.checkIn ?? f.checkIn,
        checkOut: prefill.checkOut ?? f.checkOut,
      }));
      if (autoSearch) {
        load({
          ...filters,
          city: prefill.city ?? filters.city,
          checkIn: prefill.checkIn ?? filters.checkIn,
          checkOut: prefill.checkOut ?? filters.checkOut,
        });
        return;
      }
    }

    load();
  }, []);

  const visibleHotels = useMemo(() => {
    return hotels.filter((h) => {
      if (advancedFilters.accommodationTypes.length > 0 && h._type != null) {
        if (!advancedFilters.accommodationTypes.includes(h._type)) return false;
      }

      if (advancedFilters.amenities.length > 0 && h._amenities != null) {
        const hasAll = advancedFilters.amenities.every((amenity) => h._amenities.includes(amenity));
        if (!hasAll) return false;
      }

      if (advancedFilters.maxDistanceKm < MAX_DISTANCE_KM && h._distanceKm != null) {
        if (h._distanceKm > advancedFilters.maxDistanceKm) return false;
      }

      if (advancedFilters.minRating > 0 && h._rating != null) {
        if (h._rating < advancedFilters.minRating) return false;
      }

      if (advancedFilters.stars.length > 0 && h._stars != null) {
        if (!advancedFilters.stars.includes(h._stars)) return false;
      }

      return true;
    });
  }, [hotels, advancedFilters]);


  return (
    <div className="container">
      <HotelsSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <div className="hotels-view-toolbar">
        <button
          type="button"
          className={viewMode === "list" ? "view-toggle active" : "view-toggle"}
          onClick={() => setViewMode("list")}
        >
          Ver lista
        </button>
        <button
          type="button"
          className={viewMode === "map" ? "view-toggle active" : "view-toggle"}
          onClick={() => setViewMode("map")}
        >
          Ver mapa
        </button>
      </div>

      <div className="search-layout">
        <aside className="filters">
          <HotelsFiltersPanel
            value={advancedFilters}
            onChange={(patch) => setAdvancedFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setAdvancedFilters(DEFAULT_HOTELS_FILTERS)}
          />
        </aside>

        {viewMode === "map" ? (
          <MapaHotelesNebriViajes hotels={visibleHotels} />
        ) : (
          <div className="results">
            {visibleHotels.map((h) => (
                <article key={h.id} className="hotel-card card">
                  <div className="hotel-media">
                    <img
                      src={resolveImageUrl(h.imageUrl)}
                      alt={h.name}
                      loading="lazy"
                      onError={imageFallback}
                />

                  </div>

                  <div className="hotel-body">
                    <div className="hotel-header">
                      <h3 className="hotel-title">{h.name}</h3>
                      <div className="hotel-stars">{h.stars}</div>
                    </div>

                    <p className="hotel-subtitle muted">
                      {h.city} · {h.distance}
                    </p>

                    <div className="hotel-tags">
                      <span className="pill">{h.priceNight}€ / noche</span>
                      <span className="pill">Cancelación gratis</span>
                      <span className="pill">Pago en el hotel</span>
                    </div>
                  </div>

                  <div className="hotel-side">
                    <div className="hotel-price-big">{h.price} €</div>
                    <div className="muted">impuestos incluidos</div>
                    <Link
                      to={`${PATHS.HOTELES}/${h.id}`}
                      state={{ fromDetailsButton: true }}
                      className="hotel-btn"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </article>
            ))}
            {visibleHotels.length === 0 && hotels.length > 0 ? (
              <p className="muted">No hay hoteles que cumplan los filtros seleccionados.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelsSearchPage;
