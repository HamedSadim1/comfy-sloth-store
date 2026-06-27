import React from "react";
import styled from "styled-components";
import { useCartContext } from "../Context/CartContext";
import { CartContent, CartHero, CartEmptyState } from "../components";

// Top-level cart route: thin orchestrator that composes the dedicated
// CartHero + empty-vs-content sections instead of carrying them inline.
//
// The local `Section` styled-component retains ONLY the padding rules.
// The empty-state CSS has moved to CartEmptyState.tsx where it is
// self-contained. The `className="section"` and the `<div
// className="section-center">` wrapper are deliberately preserved - both
// have global rules in src/index.css (.section => padding 5rem 0;
// .section-center => 90vw / max-width / auto margin, 95vw on >=992px) and
// droppings of them would have regressed the layout. The styled-component
// local padding wins the source-order tie-break against the global
// `.section` rule because styled-components injects after index.css.
const CartPage: React.FC = () => {
  const { cart } = useCartContext();

  return (
    <main>
      <CartHero />
      <Section className="section">
        <div className="section-center">
          {cart.length < 1 ? <CartEmptyState /> : <CartContent />}
        </div>
      </Section>
    </main>
  );
};

const Section = styled.section`
  padding: 2rem 0 6rem;

  @media (min-width: 992px) {
    padding: 3rem 0 8rem;
  }
`;

export default CartPage;
