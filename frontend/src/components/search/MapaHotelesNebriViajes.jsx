import { Link } from "react-router-dom";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";

// Arreglo necesario en Vite para que se vean los iconos de Leaflet.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SPAIN_CENTER = [40.4168, -3.7038];

const cityCoordinates = {
  madrid: [40.4168, -3.7038],
  barcelona: [41.3874, 2.1686],
  valencia: [39.4699, -0.3763],
  sevilla: [37.3891, -5.9845],
  málaga: [36.7213, -4.4214],
  malaga: [36.7213, -4.4214],
  bilbao: [43.263, -2.935],
  granada: [37.1773, -3.5986],
  córdoba: [37.8882, -4.7794],
  cordoba: [37.8882, -4.7794],
  zaragoza: [41.6488, -0.8891],
  alicante: [38.3452, -0.481],
  santander: [43.4623, -3.8099],
  salamanca: [40.9701, -5.6635],
  toledo: [39.8628, -4.0273],
};

function normalizeCity(city = "") {
  return String(city).trim().toLowerCase();
}

function hasValidCoordinates(lat, lng) {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  return Number.isFinite(parsedLat)
    && Number.isFinite(parsedLng)
    && parsedLat >= -90
    && parsedLat <= 90
    && parsedLng >= -180
    && parsedLng <= 180;
}

function getHotelPosition(hotel, index) {
  if (Array.isArray(hotel.position) && hotel.position.length === 2) {
    const [lat, lng] = hotel.position;
    if (hasValidCoordinates(lat, lng)) return [Number(lat), Number(lng)];
  }

  if (Array.isArray(hotel.posicion) && hotel.posicion.length === 2) {
    const [lat, lng] = hotel.posicion;
    if (hasValidCoordinates(lat, lng)) return [Number(lat), Number(lng)];
  }

  if (hasValidCoordinates(hotel.latitude, hotel.longitude)) {
    return [Number(hotel.latitude), Number(hotel.longitude)];
  }

  if (hasValidCoordinates(hotel.lat, hotel.lng)) {
    return [Number(hotel.lat), Number(hotel.lng)];
  }

  const base = cityCoordinates[normalizeCity(hotel.city)] || SPAIN_CENTER;

  // Plan B: si el hotel no tiene coordenadas reales, se coloca por ciudad con un pequeño desplazamiento.
  const offset = (index % 5) * 0.012;
  return [base[0] + offset, base[1] + offset];
}

function getMapCenter(hotels) {
  if (!hotels.length) return SPAIN_CENTER;
  return getHotelPosition(hotels[0], 0);
}

function FitBounds({ hotels }) {
  const map = useMap();
  const positions = hotels.map((hotel, index) => getHotelPosition(hotel, index));

  if (positions.length > 1) {
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [35, 35] });
  }

  return null;
}

function MapaHotelesNebriViajes({ hotels = [] }) {
  const center = getMapCenter(hotels);

  if (!hotels.length) {
    return (
      <div className="hotel-map-empty">
        No hay hoteles para mostrar en el mapa con estos filtros.
      </div>
    );
  }

  return (
    <section className="hotel-map-panel card">
      <div className="hotel-map-header">
        <div>
          <h2>Mapa de hoteles</h2>
          <p className="muted">Pulsa en un marcador para ver ubicación, precio y detalle.</p>
        </div>
        <span className="pill">{hotels.length} hoteles</span>
      </div>

      <div className="hotel-map-wrapper">
        <MapContainer center={center} zoom={6} scrollWheelZoom className="hotel-map">
          <FitBounds hotels={hotels} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotels.map((hotel, index) => (
            <Marker key={hotel.id || hotel._id} position={getHotelPosition(hotel, index)}>
              <Popup>
                <article className="hotel-map-popup">
                  {hotel.imageUrl ? (
                    <img src={resolveImageUrl(hotel.imageUrl)} alt={hotel.name}   onError={imageFallback}
                />
                  ) : null}

                  <h3>{hotel.name}</h3>
                  <p>{hotel.address || hotel.city || "Ubicación no indicada"}</p>
                  <strong>{hotel.price} € / noche</strong>

                  <Link
                    to={`${PATHS.HOTELES}/${hotel.id || hotel._id}`}
                    state={{ fromDetailsButton: true }}
                    className="hotel-map-popup-btn"
                  >
                    Ver detalles
                  </Link>
                </article>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default MapaHotelesNebriViajes;
