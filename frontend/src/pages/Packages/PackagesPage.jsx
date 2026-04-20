import { useEffect, useState } from "react";
import { getPackages } from "../../api/packages";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function PackagesPage() {
  const [packages, setPackages] = useState([]);


function shuffle(list) {
  const result = [];

  while (list.length > 0) {
    const randomIndex = Math.floor(Math.random() * list.length);
    result.push(list[randomIndex]);
    list.splice(randomIndex, 1);
  }

  return result;
}


  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getPackages();
        const mapped = (data?.results || []).map((p) => ({
          id: p._id,
          title: p.title,
          city: p.destination,
          days: p.durationDays,
          tag: p.available === false ? "No disponible" : "Disponible",
          price: p.price,
          imageUrl: p.imageUrl,
        }));
        if (mounted) setPackages(shuffle(mapped));
      } catch (e) {
        if (mounted) setPackages([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <h2>Paquetes</h2>
      <p className="muted">Vuelo + hotel + actividades, al mejor precio.</p>

      <div className="grid-cards">
        {packages.map((p) => (
            <article key={p.id} className="deal-card card">
              <div className="deal-img">
                <img
                  src={resolveImageUrl(p.imageUrl)}
                  alt={p.title}
                  loading="lazy"
                />
              </div>
              <div className="deal-info">
                <h3>{p.title}</h3>
                <p className="muted">{p.city} · {p.days} días</p>
                <span className="badge">{p.tag}</span>
              </div>
              <div className="deal-price">
                <div className="price">{p.price} €</div>
                <div className="muted">por persona</div>
                <Link
                  to={`${PATHS.PAQUETES}/${p.id}`}
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
  );
}

export default PackagesPage;
