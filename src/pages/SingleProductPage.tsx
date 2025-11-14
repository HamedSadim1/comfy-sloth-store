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

const SingleProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useComfy(id!);

  if (!data) return null;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }
  // const navigate = useNavigate();
  return (
    <Wrapper>
      <PageHero title={data.name} product={data} />
      <div className="section section-center page">
        <Link to="/products" className="btn">
          back to products
        </Link>
        <div className="product-center">
          <ProductImages images={data.images} />
          <section className="content">
            <h2>{data.name}</h2>
            <Stars reviews={data.reviews} stars={data.stars} />
            <h5 className="price">{formatPrice(data.price)}</h5>
            <p className="desc">{data.description}</p>
            <p className="info">
              <span>Available : </span>
              {data.stock > 0 ? "In stock" : "Out of stock"}
            </p>
            <p className="info">
              <span>SKU : </span>
              {data.id}
            </p>
            <p className="info">
              <span>Brand : </span>
              {data.company}
            </p>
            <hr />
            {data.stock > 0 && <AddToCart product={data} />}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`;
export default SingleProductPage;
