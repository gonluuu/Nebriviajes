import { useEffect, useState } from "react";
import { getOffers } from "../../api/offers";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function OffersPage() {
  const [offers, setOffers] = useState([]);


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
        const data = await getOffers();
        const mapped = (data?.results || []).map((o) => ({
          id: o._id,
          title: o.title,
          desc: o.description || "",
          tag: o.destination || o.type,
          price: o.price,
          imageUrl: o.imageUrl,
        }));
        if (mounted) setOffers(shuffle(mapped));
      } catch (e) {
        if (mounted) setOffers([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <h2>Ofertas</h2>
      <p className="muted">Descuentos y promociones por tiempo limitado.</p>

      <div className="grid-cards">
        {offers.map((o) => (
            <article key={o.id} className="deal-card card">
              <div className="deal-img">
                <img
                  src={resolveImageUrl(o.imageUrl)}
                  alt={o.title}
                  loading="lazy"
                />
              </div>
              <div className="deal-info">
                <h3>{o.title}</h3>
                <p className="muted">{o.desc}</p>
                <span className="badge">{o.tag}</span>
              </div>
              <div className="deal-price">
                <div className="price">{o.price} €</div>
                <div className="muted">desde</div>
                <Link
                  to={`${PATHS.OFERTAS}/${o.id}`}
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

export default OffersPage;
