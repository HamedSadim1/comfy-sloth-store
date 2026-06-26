import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import {
  ProductImages,
  AddToCart,
  Stars,
  PageHero,
  Loading,
} from "../components";
import useComfy from "../hooks/useComfy";
import { FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";

// Sub-component: meta pill with label + value
interface MetaPillProps {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning";
}

const MetaPill: React.FC<MetaPillProps> = ({ label, value, variant }) => (
  <span className={`pill ${variant ?? ""}`}>
    <small>{label}</small>
    <strong>{value}</strong>
  </span>
);

// Sub-component: compact trust row (no separate full section)
const TrustRow: React.FC = () => (
  <ul className="trust-row" aria-label="Buying with Comfy Sloth">
    <li>
      <FiTruck aria-hidden="true" />
      <div>
        <strong>Free shipping</strong>
        <span>Over €50</span>
      </div>
    </li>
    <li>
      <FiRefreshCw aria-hidden="true" />
      <div>
        <strong>30-day returns</strong>
        <span>No questions</span>
      </div>
    </li>
    <li>
      <FiShield aria-hidden="true" />
      <div>
        <strong>Secure checkout</strong>
        <span>Stripe-powered</span>
      </div>
    </li>
  </ul>
);

const SingleProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useComfy(id!);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (!data) return null;

  return (
    <Wrapper>
      <PageHero title={data.name} product={data} />
      <div className="section section-center page">
        <Link to="/products" className="back-link">
          <span aria-hidden="true">←</span> Back to products
        </Link>

        <div className="product-center">
          <div className="gallery-col">
            <ProductImages images={data.images} />
          </div>

          <section className="info">
            <div className="info-card">
              <span className="category-chip">{data.category}</span>
              <h1 className="display">{data.name}</h1>
              <Stars reviews={data.reviews} stars={data.stars} />
              <h2 className="price">{formatPrice(data.price)}</h2>
              <p className="desc">{data.description}</p>

              <div className="meta-row" aria-label="Product details">
                <MetaPill
                  label="Availability"
                  value={data.stock > 0 ? "In stock" : "Out of stock"}
                  variant={data.stock > 0 ? "success" : "warning"}
                />
                <MetaPill label="SKU" value={data.id} />
                <MetaPill label="Brand" value={data.company} />
              </div>

              <hr className="divider" />

              {data.stock > 0 && <AddToCart product={data} />}

              <hr className="divider" />
              <TrustRow />
            </div>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  background: var(--gradient-soft);
  min-height: calc(100vh - 10rem);

  .section {
    padding: 3rem 0 6rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.95rem;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(34, 34, 34, 0.08);
    color: var(--clr-grey-1);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: none;
    margin-bottom: 1.75rem;
    transition:
      background 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out);

    &:hover {
      background: var(--clr-white);
      border-color: rgba(34, 34, 34, 0.2);
      transform: translateX(3px);
    }
  }

  .product-center {
    display: grid;
    gap: 2.5rem;
    align-items: start;
  }

  /* Gallery column */
  .gallery-col {
    width: 100%;
    min-width: 0;
  }

  /* Info card */
  .info {
    width: 100%;
    min-width: 0;
  }

  .info-card {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-2xl);
    padding: 2rem 1.5rem;
    box-shadow: var(--shadow-md);
  }

  .category-chip {
    display: inline-block;
    padding: 0.35rem 0.85rem;
    background: var(--clr-primary-10);
    color: var(--clr-primary-2);
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border-radius: var(--radius-full);
    margin-bottom: 1rem;
  }

  .display {
    font-size: var(--fs-display-sm);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--clr-grey-1);
    text-transform: none;
    line-height: 1.1;
    margin-bottom: 1rem;
  }

  .price {
    font-size: clamp(1.5rem, 2vw + 0.5rem, 2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 1.25rem 0 1.5rem;
  }

  .desc {
    color: var(--clr-grey-5);
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1.75rem;
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(34, 34, 34, 0.06);
    margin: 1.5rem 0;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.85rem;
    background: var(--clr-grey-10);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    color: var(--clr-grey-2);
    letter-spacing: 0;

    small {
      color: var(--clr-grey-5);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.65rem;
      font-weight: 700;
    }

    strong {
      color: var(--clr-grey-1);
      font-weight: 600;
      text-transform: capitalize;
    }

    &.success {
      background: rgba(86, 158, 100, 0.12);
      border-color: rgba(86, 158, 100, 0.3);

      strong {
        color: hsl(125, 50%, 28%);
      }
    }

    &.warning {
      background: rgba(204, 80, 80, 0.1);
      border-color: rgba(204, 80, 80, 0.28);

      strong {
        color: var(--clr-red-dark);
      }
    }
  }

  .trust-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1rem;
      background: var(--clr-primary-10);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(204, 152, 110, 0.18);

      svg {
        flex-shrink: 0;
        width: 1.4rem;
        height: 1.4rem;
        padding: 0.3rem;
        border-radius: var(--radius-md);
        background: var(--clr-white);
        color: var(--clr-primary-2);
        box-sizing: content-box;
        box-shadow: var(--shadow-xs);
        transition:
          background 0.3s var(--ease-out),
          color 0.3s var(--ease-out);
      }

      div {
        display: flex;
        flex-direction: column;
      }

      strong {
        color: var(--clr-grey-1);
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0;
      }

      span {
        color: var(--clr-grey-5);
        font-size: 0.78rem;
        letter-spacing: 0;
      }

      &:hover svg {
        background: var(--gradient-accent);
        color: var(--clr-white);
      }
    }
  }

  @media (min-width: 992px) {
    .section {
      padding: 4rem 0 8rem;
    }

    .product-center {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
      gap: 3rem;
      align-items: start;
    }

    .info {
      position: sticky;
      top: 6.5rem;
    }

    .info-card {
      padding: 2.25rem 2rem;
    }

    .trust-row {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.85rem;
    }
  }

  @media (min-width: 1280px) {
    .info-card {
      padding: 2.5rem 2.25rem;
    }
  }
`;

export default SingleProductPage;
