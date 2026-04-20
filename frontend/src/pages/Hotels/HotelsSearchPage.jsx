import { useEffect, useState } from "react";
import HotelsSearchBar from "../../components/search/HotelsSearchBar.jsx";
import FiltersPanel from "../../components/search/FiltersPanel.jsx";
import { getHotels } from "../../api/hotels";
import { Link, useLocation } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import FiltersSidebar from "../../components/search/FiltersSidebar";
import FavoriteButton from "../../components/common/FavoriteButton";

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

  const [advFilters, setAdvFilters] = useState({});
  const [budget, setBudget] = useState("");

  const [hotels, setHotels] = useState([]);

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
      date: nextFilters.checkIn,
      minPrice: nextFilters.minPrice,
      maxPrice: nextFilters.maxPrice,
      // Map advanced filters
      stars: (advFilters.stars || []).join(","),
      freeCancellation: advFilters.freeCancellation ? "true" : "",
    });

    const data = await getHotels(params);

    const mapped = (data?.results || []).map((h) => ({
      id: h._id,
      name: h.name,
      type: "hotel",
      title: h.name,
      subtitle: h.city,
      linkUrl: `${PATHS.HOTELES}/${h._id}`,
      stars: "★★★",
      city: h.city,
      distance: "Centro",
      price: h.price,
      priceNight: h.price,
      imageUrl: h.imageUrl,
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
  }, [advFilters]);

  useEffect(() => {
    const ranges = {
      "0-50": { minPrice: "0", maxPrice: "50" },
      "50-100": { minPrice: "50", maxPrice: "100" },
      "100-150": { minPrice: "100", maxPrice: "150" },
      "150-200": { minPrice: "150", maxPrice: "200" },
      "200+": { minPrice: "200", maxPrice: "" },
      "": { minPrice: "", maxPrice: "" },
    };

    const next = ranges[budget] || ranges[""];
    setFilters((f) => ({ ...f, ...next }));

    load({ ...filters, ...next });
  }, [budget]);


  return (
    <div className="container">
      <HotelsSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <div className="search-layout">
        <aside className="filters">
          <FiltersPanel value={budget} onChange={setBudget} />
          <FiltersSidebar
            category="hotels"
            onFiltersChange={setAdvFilters}
            initialFilters={advFilters}
          />
        </aside>

        <div className="results">
          {hotels.map((h) => (
            <article key={h.id} className="hotel-card card" style={{ position: "relative" }}>
              <FavoriteButton item={h} />
              <div className="hotel-media">
                <img
                  src={resolveImageUrl(h.imageUrl)}
                  alt={h.name}
                  loading="lazy"
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
        </div>
      </div>
    </div>
  );
}

export default HotelsSearchPage;
