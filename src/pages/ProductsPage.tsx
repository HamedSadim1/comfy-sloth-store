import styled from "styled-components";
import { ProductList, Sort, PageHero, Filters } from "../components";

const ProductsPage = () => {
  return (
    <main>
      <PageHero title="Products" />
      <Wrapper>
        <div className="section-center layout">
          <Filters />
          <div className="content">
            <Sort />
            <ProductList />
          </div>
        </div>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.section`
  padding: 3rem 0 6rem;
  background: var(--clr-white);

  .layout {
    display: grid;
    gap: 2.5rem;
    margin: 0 auto;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 0; /* prevents grid blowout from wide children */
  }

  @media (min-width: 768px) {
    .layout {
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 3rem;
    }
  }

  @media (min-width: 992px) {
    padding: 4rem 0 8rem;
    .layout {
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 3.5rem;
    }
  }
`;

export default ProductsPage;
